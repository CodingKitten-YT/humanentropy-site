import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { 
  initializeDatabase, 
  submitPattern, 
  updateContributionCount, 
  closeDatabase 
} from '@/lib/database'

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // Max 5 submissions per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  userLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get session to verify user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Rate limiting
    if (!checkRateLimit(session.user.name)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting again.' },
        { status: 429 }
      )
    }

    // Parse request body with size limit
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50000) { // 50KB limit
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }

    const body = await request.json()
    const { coordinates, optedInForCredit = true } = body

    // Validate coordinates array
    if (!Array.isArray(coordinates)) {
      return NextResponse.json(
        { error: 'Invalid coordinates format. Must be an array.' },
        { status: 400 }
      )
    }

    if (coordinates.length < 80 || coordinates.length > 1024) { // Reasonable upper limit
      return NextResponse.json(
        { error: `Invalid coordinates count. Must be between 80 and 1024 points. Received: ${coordinates.length}` },
        { status: 400 }
      )
    }

    // Validate coordinate format and detect potential attacks
    const uniqueCoords = new Set<string>()
    for (const coord of coordinates) {
      if (
        typeof coord !== 'object' ||
        typeof coord.x !== 'number' || 
        typeof coord.y !== 'number' ||
        !Number.isInteger(coord.x) ||
        !Number.isInteger(coord.y) ||
        coord.x < 0 || coord.x >= 32 ||
        coord.y < 0 || coord.y >= 32
      ) {
        return NextResponse.json(
          { error: 'Invalid coordinate format. Must be integer {x, y} within 32x32 grid.' },
          { status: 400 }
        )
      }
      
      // Check for duplicates
      const coordKey = `${coord.x},${coord.y}`
      if (uniqueCoords.has(coordKey)) {
        return NextResponse.json(
          { error: 'Duplicate coordinates detected.' },
          { status: 400 }
        )
      }
      uniqueCoords.add(coordKey)
    }

    // Validate opted in flag
    if (typeof optedInForCredit !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid optedInForCredit value. Must be boolean.' },
        { status: 400 }
      )
    }

    // Initialize database
    const db = await initializeDatabase()

    try {
      // Submit pattern anonymously with comprehensive features
      await submitPattern(db, coordinates, optedInForCredit)

      // Update contribution count separately (only if opted in for credit)
      if (optedInForCredit) {
        await updateContributionCount(db, session.user.name, false)
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Pattern submitted successfully!',
        points_submitted: coordinates.length
      })

    } finally {
      // Always close database connection
      await closeDatabase(db)
    }

  } catch (error) {
    console.error('Error submitting pattern:', error)
    
    // Don't expose internal errors to client
    if (error instanceof Error && error.message.includes('SQLITE_CONSTRAINT')) {
      return NextResponse.json(
        { error: 'Database constraint violation. Please try again.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
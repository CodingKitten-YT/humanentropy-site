import { NextRequest, NextResponse } from 'next/server'
import { 
  initializeDatabase, 
  submitPattern, 
  closeDatabase 
} from '@/lib/database'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 2 // Max 2 submissions per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  userLimit.count++
  return true
}

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
        response: token,
        remoteip: ip,
      }),
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'

    // Rate limiting
    if (!checkRateLimit(ip)) {
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
    const { coordinates, captchaToken } = body

    // Validate captcha token
    if (!captchaToken || typeof captchaToken !== 'string') {
      return NextResponse.json(
        { error: 'Captcha verification required' },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    const isValidCaptcha = await verifyTurnstileToken(captchaToken, ip)
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Captcha verification failed. Please try again.' },
        { status: 400 }
      )
    }
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

    // Initialize database
    const db = await initializeDatabase()

    try {
      // Submit pattern anonymously with comprehensive features
      await submitPattern(db, coordinates, true)

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
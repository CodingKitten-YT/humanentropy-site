import { NextRequest, NextResponse } from 'next/server'
import { 
  initializeDatabase, 
  getLeaderboard, 
  getTotalStats,
  closeDatabase 
} from '@/lib/database'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // Validate limit
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Initialize database
    const db = await initializeDatabase()

    try {
      // Get leaderboard and stats in parallel
      const [leaderboard, stats] = await Promise.all([
        getLeaderboard(db, limit),
        getTotalStats(db)
      ])

      return NextResponse.json({
        success: true,
        data: {
          leaderboard,
          stats
        }
      })

    } finally {
      // Always close database connection
      await closeDatabase(db)
    }

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { 
  resetDatabase, 
  initializeDatabase,
  getDatabaseStats,
  closeDatabase 
} from '@/lib/database'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Admin users - in production, use environment variables or database
const ADMIN_USERS = ['CodingKitten-YT'] // Add your GitHub username

function isAdmin(username: string | null | undefined): boolean {
  return username ? ADMIN_USERS.includes(username) : false
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const db = await initializeDatabase()
    try {
      const stats = await getDatabaseStats(db)
      return NextResponse.json({
        success: true,
        stats
      })
    } finally {
      await closeDatabase(db)
    }

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'reset') {
      await resetDatabase()
      return NextResponse.json({
        success: true,
        message: 'Database reset successfully. All data has been deleted.'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: reset' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in admin action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { coordinates } = await request.json()
    
    if (!coordinates || !Array.isArray(coordinates)) {
      return NextResponse.json({ error: 'Invalid coordinates data' }, { status: 400 })
    }

    // Here you would typically save to a database
    console.log('Pattern submitted by:', session.user.name)
    console.log('GitHub username:', session.user.name)
    console.log('Coordinates:', coordinates)
    
    // Simulate saving to database
    const patternData = {
      userId: session.user.id,
      username: session.user.name,
      email: session.user.email,
      coordinates,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Pattern submitted successfully',
      data: patternData 
    })
    
  } catch (error) {
    console.error('Error submitting pattern:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
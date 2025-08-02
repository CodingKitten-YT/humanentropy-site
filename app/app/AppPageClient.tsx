'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import PatternCanvas from '@/components/PatternCanvas'
import Leaderboard from '@/components/Leaderboard'

export default function AppPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run auth checks on client side
    if (!isClient) return
    
    // Give more time in production for session to load
    const redirectTimer = setTimeout(() => {
      if (status === 'unauthenticated') {
        router.push('/login')
      }
    }, 2000) // 2 second delay for production

    // Clear timer if we get authenticated
    if (status === 'authenticated') {
      clearTimeout(redirectTimer)
    }
    
    return () => clearTimeout(redirectTimer)
  }, [status, session, router, isClient])

  // Don't render anything until we're on client side
  if (!isClient) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Show loading while checking authentication (client-side only)
  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <PatternCanvas />
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 py-12">
            <Leaderboard />
          </div>
        </div>
      </main>
    </>
  )
}

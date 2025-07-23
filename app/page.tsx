'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import DotGrid from '@/components/DotGrid'
import Leaderboard from '@/components/Leaderboard'
import AuthPrompt from '@/components/AuthPrompt'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        {status === 'loading' ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        ) : session ? (
          <>
            <DotGrid />
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <div className="container mx-auto px-4 py-12">
                <Leaderboard />
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <AuthPrompt />
          </div>
        )}
      </main>
    </>
  )
}
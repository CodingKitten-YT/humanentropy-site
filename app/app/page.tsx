'use client'

import Header from '@/components/Header'
import PatternCanvas from '@/components/PatternCanvas'
import Leaderboard from '@/components/Leaderboard'

export default function AppPage() {
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

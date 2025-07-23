'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import DotGrid from '@/components/DotGrid'
import AuthPrompt from '@/components/AuthPrompt'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {status === 'loading' ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : session ? (
          <DotGrid />
        ) : (
          <AuthPrompt />
        )}
      </main>
    </>
  )
}
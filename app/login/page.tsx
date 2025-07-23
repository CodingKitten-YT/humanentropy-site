'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/Header'
import AuthPrompt from '@/components/AuthPrompt'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/app')
    }
  }, [session, router])

  if (status === 'loading') {
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

  if (session) {
    return null // Will redirect to /app
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-8">
          <AuthPrompt />
        </div>
      </main>
    </>
  )
}

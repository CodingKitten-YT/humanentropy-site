'use client'

import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/app')
    }
  }, [session, router])

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/app' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Redirecting to app...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">HumanEntropy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sign in to start contributing patterns to our research project
          </p>
          
          <Button 
            onClick={handleGitHubSignIn}
            className="w-full flex items-center justify-center space-x-2"
            size="lg"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            By signing in, you agree to contribute anonymous pattern data to our open research project.
          </p>
        </div>
      </div>
    </div>
  )
}
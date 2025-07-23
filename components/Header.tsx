'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogIn, LogOut, Github } from 'lucide-react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <img 
                src="/logo.svg" 
                alt="HumanEntropy Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
              />
              <h1 className="text-lg sm:text-xl font-bold text-blue-500">
                HumanEntropy
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            {status === 'loading' ? (
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                    <AvatarImage src={session.user?.image || ''} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user?.name}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn('github')}
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Sign in</span>
                <span className="hidden sm:inline">with GitHub</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
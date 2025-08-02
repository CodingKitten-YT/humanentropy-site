'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Home } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-blue-500">
                HumanEntropy
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {pathname !== '/' && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            )}
            <ThemeToggle />
            {pathname !== '/app' && (
              <Link href="/app">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <span>Create Pattern</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
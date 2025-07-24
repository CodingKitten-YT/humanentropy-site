'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowRight, Github, Brain, Search, Users, Shield, BarChart3, Zap } from 'lucide-react'

// Generate random pattern
const generateRandomPattern = () => {
  const pattern = []
  const numDots = Math.floor(Math.random() * 15) + 8 // 8-23 dots
  const usedPositions = new Set()
  
  for (let i = 0; i < numDots; i++) {
    let position
    do {
      position = Math.floor(Math.random() * 64)
    } while (usedPositions.has(position))
    usedPositions.add(position)
    pattern.push(position)
  }
  
  return pattern
}

export default function HomePage() {
  const [currentPattern, setCurrentPattern] = useState<number[]>([])
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Initialize with first pattern
    setCurrentPattern(generateRandomPattern())
    
    // Change pattern every 3 seconds
    const interval = setInterval(() => {
      setCurrentPattern(generateRandomPattern())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Auto-redirect handled by NextAuth configuration on first login

  const handleContribute = () => {
    if (session) {
      router.push('/app')
    } else {
      signIn('github')
    }
  }

  return (
    <>
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-blue-500">HumanEntropy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {session ? (
                <Button 
                  size="sm" 
                  className="flex items-center space-x-2"
                  onClick={() => router.push('/app')}
                >
                  <Brain className="w-4 h-4" />
                  <span>Create Pattern</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="flex items-center space-x-2"
                  onClick={handleContribute}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>Contribute Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-300">
                <Brain className="w-3 h-3 mr-1" />
                Help Us Figure Out
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent mb-6">
                How Random<br />
                <span className="text-blue-500">Humans Really Are</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                This is HumanEntropy — an open research project I (a 15 y/o hobby dev) started to explore how people think about randomness and patterns. Your clicks become data that help build smarter AI (and maybe teach machines how not to be weird about randomness).
              </p>
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-8">
                Every dot you place helps science.<br />
                Seriously.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="flex items-center space-x-2 text-lg px-8 py-3"
                onClick={handleContribute}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    <span>Contribute Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                <a href="#about">What's This About?</a>
              </Button>
            </div>

            {/* Simple Grid Preview */}
            <div className="max-w-sm mx-auto">
              <div 
                className="grid gap-1 p-2 bg-gray-300 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-800"
                style={{
                  gridTemplateColumns: 'repeat(8, 1fr)',
                }}
              >
                {Array.from({ length: 64 }, (_, i) => {
                  const isActive = currentPattern.includes(i)
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm transition-all duration-500 ${
                        isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About This Project</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                I've always been fascinated by how humans are bad at being random (like, really bad).<br />
                So I built this platform to turn that into real, open research — and let anyone contribute.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <Brain className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle>Why This Exists</CardTitle>
                  <CardDescription>
                    We're testing how humans make patterns, and whether a machine can tell the difference.
                    Your input becomes part of a dataset used to train an ML model to detect "humanness."
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <Users className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle>Built With Hack Club Energy</CardTitle>
                  <CardDescription>
                    This whole thing is open-source, community-powered, and made for curious minds like you.
                    You get to contribute data, see results, and shape how the research grows.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <Shield className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle>Transparent + Opt-In</CardTitle>
                  <CardDescription>
                    Nothing personal is stored unless you want credit. Data is anonymized, 
                    and you can opt out of attribution anytime.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <BarChart3 className="w-8 h-8 text-red-500 mb-2" />
                  <CardTitle>What Happens to Your Dots?</CardTitle>
                  <CardDescription>
                    Every pattern gets broken down into 20+ features like clustering, symmetry, density, etc.
                    You can even see the stats of what you just made.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                  <CardTitle>Real Research Vibes</CardTitle>
                  <CardDescription>
                    The final dataset and models will be fully open for anyone to play with, 
                    build on, or write about.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <Github className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-2" />
                  <CardTitle>Ready to Click?</CardTitle>
                  <CardDescription>
                    Add a few dots to science. You'll be contributing to a real dataset, 
                    and maybe even help an ML model figure out what makes people human.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Click?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Add a few dots to science. You'll be contributing to a real dataset, 
              and maybe even help an ML model figure out what makes people human.
            </p>
            <Button 
              size="lg" 
              className="text-xl px-12 py-4"
              onClick={handleContribute}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Signing in...
                </>
              ) : (
                <>
                  <Github className="w-6 h-6 mr-3" />
                  Let's Go
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-blue-500 mb-2">HumanEntropy</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              A community-powered pattern research project by a 15 y/o nerd.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 — Made for Hack Clubbers, by one.
            </p>
          </div>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-500 transition-colors">Open Source</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-500 transition-colors">Research Data</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  )
}
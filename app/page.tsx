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

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <>
      {/* Schema markup for research project */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ResearchProject",
            "name": "HumanEntropy",
            "description": "An open research project studying how humans create patterns and randomness, using the data to train machine learning models.",
            "url": "https://didactic-space-sniffle-9v55vxpq765fp646-3000.app.github.dev",
            "sponsor": {
              "@type": "Person",
              "name": "15-year-old developer and researcher"
            },
            "researcher": {
              "@type": "Person", 
              "name": "HumanEntropy Research Team"
            },
            "funding": {
              "@type": "Grant",
              "funder": {
                "@type": "Organization",
                "name": "Open Source Community"
              }
            },
            "about": [
              {
                "@type": "Thing",
                "name": "Human Randomness"
              },
              {
                "@type": "Thing", 
                "name": "Machine Learning"
              },
              {
                "@type": "Thing",
                "name": "Pattern Recognition"
              }
            ]
          })
        }}
      />
      
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
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto text-center relative">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-300 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-black/80">
                <Brain className="w-3 h-3 mr-1" />
                Help Us Figure Out
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-600 dark:from-gray-100 dark:via-blue-300 dark:to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
                How Random<br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Humans Really Are</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                This is HumanEntropy — an open research project I (a 15 y/o hobby dev) started to explore how people think about randomness and patterns. Your clicks become data that help build smarter AI (and maybe teach machines how not to be weird about randomness).
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800 mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  Every dot you place helps science. Seriously.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="flex items-center space-x-2 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-black/80" 
                onClick={scrollToAbout}
              >
                What's This About?
              </Button>
            </div>

            {/* Enhanced Grid Preview */}
            <div className="max-w-sm mx-auto relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-xl"></div>
              <div 
                className="relative grid gap-1 p-4 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-sm"
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
                        isActive 
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm scale-110' 
                          : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    />
                  )
                })}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/80 px-2 py-1 rounded-full">
                Live Preview
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative py-24 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
                About This Project
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                I've always been fascinated by how humans are bad at being random (like, really bad).<br />
                So I built this platform to turn that into real, open research — and let anyone contribute.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">Why This Exists</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We're testing how humans make patterns, and whether a machine can tell the difference.
                    Your input becomes part of a dataset used to train an ML model to detect "humanness."
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-2 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">Built With Hack Club Energy</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    This whole thing is open-source, community-powered, and made for curious minds like you.
                    You get to contribute data, see results, and shape how the research grows.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">Transparent + Opt-In</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Nothing personal is stored unless you want credit. Data is anonymized, 
                    and you can opt out of attribution anytime.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-2 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">What Happens to Your Dots?</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Every pattern gets broken down into 20+ features like clustering, symmetry, density, etc.
                    All data becomes part of the open research dataset.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-2 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">Real Research Vibes</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The final dataset and models will be fully open for anyone to play with, 
                    build on, or write about.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">Ready to Click?</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Place 80 dots to contribute to science. You'll be adding to a real dataset, 
                    and maybe even help an ML model figure out what makes people human.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-900 dark:to-purple-950/20">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-8 shadow-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-1"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-75"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              Ready to Click?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Place 80 dots to contribute to science. You'll be adding to a real dataset, 
              and maybe even help an ML model figure out what makes people human.
            </p>
            <Button 
              size="lg" 
              className="text-xl px-12 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 transform hover:scale-105"
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
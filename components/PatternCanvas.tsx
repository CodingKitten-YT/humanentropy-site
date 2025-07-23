'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Send, Info } from 'lucide-react'
import { toast } from 'sonner'

interface Coordinate {
  x: number
  y: number
}

const GRID_SIZE = 32

export default function PatternCanvas() {
  const { data: session } = useSession()
  const [selectedDots, setSelectedDots] = useState<Set<string>>(new Set())
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [optedInForCredit, setOptedInForCredit] = useState(true)

  const toggleDot = useCallback((x: number, y: number) => {
    if (!session) return
    
    const key = `${x}-${y}`
    const newSelectedDots = new Set(selectedDots)
    const newCoordinates = [...coordinates]

    if (selectedDots.has(key)) {
      newSelectedDots.delete(key)
      const index = newCoordinates.findIndex(coord => coord.x === x && coord.y === y)
      if (index > -1) {
        newCoordinates.splice(index, 1)
      }
    } else {
      newSelectedDots.add(key)
      newCoordinates.push({ x, y })
    }

    setSelectedDots(newSelectedDots)
    setCoordinates(newCoordinates)
  }, [session, selectedDots, coordinates])

  const clearAll = useCallback(() => {
    setSelectedDots(new Set())
    setCoordinates([])
    toast.success('Grid cleared')
  }, [])

  const submitPattern = useCallback(async () => {
    if (coordinates.length === 0) {
      toast.error('Please place at least one dot before submitting')
      return
    }

    if (coordinates.length < 80) {
      toast.error(`Please place at least 80 dots before submitting. You currently have ${coordinates.length} dots.`)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          coordinates, 
          optedInForCredit 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Pattern submitted successfully!')
        setSelectedDots(new Set())
        setCoordinates([])
      } else {
        toast.error(data.error || 'Failed to submit pattern')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [coordinates, optedInForCredit])

  const renderGrid = () => {
    const cells = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x}-${y}`
        const isSelected = selectedDots.has(key)
        
        cells.push(
          <button
            key={key}
            onClick={() => toggleDot(x, y)}
            disabled={!session}
            className={`
              aspect-square border transition-colors duration-75 active:scale-95 w-full h-full min-h-0 min-w-0
              ${isSelected 
                ? 'bg-blue-500 border-blue-400 shadow-sm' 
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              ${!session ? 'cursor-not-allowed opacity-50' : 'cursor-pointer select-none'}
            `}
            title={session ? `(${x}, ${y})` : 'Please sign in to interact'}
          />
        )
      }
    }
    return cells
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col xl:flex-row gap-6 max-w-none">
        {/* Grid Section */}
        <Card className="flex-1 min-w-0 flex flex-col">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-base sm:text-lg xl:text-xl">Pattern Canvas (32×32)</span>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <Badge variant="outline" className="text-xs">
                  {coordinates.length} dots
                </Badge>
                {coordinates.length < 80 && (
                  <Badge 
                    variant={coordinates.length > 0 ? "secondary" : "destructive"} 
                    className="text-xs"
                  >
                    {coordinates.length > 0 
                      ? `${80 - coordinates.length} more`
                      : 'Min: 80'
                    }
                  </Badge>
                )}
                {coordinates.length >= 80 && (
                  <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                    Ready!
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center flex-1 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Progress bar for 80-dot minimum - always present to prevent layout shift */}
            <div className="w-full max-w-lg mb-4 h-12 sm:h-16 flex flex-col justify-center">
              {coordinates.length > 0 && coordinates.length < 80 && (
                <>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-medium">Progress to minimum</span>
                    <span className="font-mono font-semibold">{coordinates.length}/80</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{ width: `${(coordinates.length / 80) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                    {80 - coordinates.length} more dots needed
                  </div>
                </>
              )}
            </div>
            
            {/* Grid Container */}
            <div 
              className="grid gap-0 p-2 bg-gray-300 dark:bg-gray-700 rounded-md sm:rounded-lg shadow-inner mb-4 border border-gray-200 dark:border-gray-800 w-full max-w-2xl"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                aspectRatio: '1/1'
              }}
            >
              {renderGrid()}
            </div>
            
            {session && (
              <div className="flex flex-col gap-4 w-full max-w-lg">
                {/* Privacy opt-in checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Checkbox
                    id="credit-opt-in"
                    checked={optedInForCredit}
                    onCheckedChange={(checked) => setOptedInForCredit(checked as boolean)}
                    className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor="credit-opt-in"
                      className="text-sm font-medium leading-tight text-blue-900 dark:text-blue-100 cursor-pointer block mb-2"
                    >
                      Be credited publicly on the leaderboard
                    </label>
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        We will show your GitHub username and submission count, but will never link your name to any specific dot pattern.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    disabled={coordinates.length === 0}
                    className="flex items-center justify-center gap-2 flex-1 h-10 text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                  <Button
                    onClick={submitPattern}
                    disabled={isSubmitting || coordinates.length < 80}
                    className={`flex items-center justify-center gap-2 flex-1 h-10 text-sm transition-all duration-200 ${
                      coordinates.length < 80 && coordinates.length > 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : coordinates.length >= 80 
                          ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25' 
                          : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    title={
                      coordinates.length < 80 && coordinates.length > 0
                        ? `Need ${80 - coordinates.length} more dots to submit`
                        : 'Submit your pattern'
                    }
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Pattern'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coordinates Panel */}
        <Card className="w-full xl:w-80 xl:min-w-80 xl:max-h-[calc(100vh-8rem)] xl:flex xl:flex-col">
          <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Coordinates</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 xl:min-h-0 px-4 sm:px-6 pb-4 sm:pb-6">
            {coordinates.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300 text-center py-8 text-sm">
                {session ? 'Click on the grid to place dots' : 'Sign in to start placing dots'}
              </p>
            ) : (
              <ScrollArea className="h-64 xl:h-full">
                <div className="space-y-2 pr-2">
                  {coordinates.map((coord, index) => (
                    <div
                      key={`${coord.x}-${coord.y}`}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-md text-sm"
                    >
                      <span className="font-mono">
                        ({coord.x}, {coord.y})
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
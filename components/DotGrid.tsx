'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Coordinate {
  x: number
  y: number
}

const GRID_SIZE = 32

export default function DotGrid() {
  const { data: session } = useSession()
  const [selectedDots, setSelectedDots] = useState<Set<string>>(new Set())
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleDot = useCallback((x: number, y: number) => {
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
  }, [selectedDots, coordinates])

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

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit-pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
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
  }, [coordinates])

  const renderGrid = () => {
    const cells = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x}-${y}`
        const isSelected = selectedDots.has(key)
        
        cells.push(
          <button
            key={key}
            onClick={() => session && toggleDot(x, y)}
            disabled={!session}
            className={`
              w-4 h-4 border border-gray-200 transition-all duration-150 hover:scale-110
              ${isSelected 
                ? 'bg-blue-500 border-blue-600 shadow-md' 
                : 'bg-white hover:bg-gray-100'
              }
              ${!session ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              rounded-sm
            `}
            title={session ? `(${x}, ${y})` : 'Please sign in to interact'}
          />
        )
      }
    }
    return cells
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-6">
      {/* Grid Section */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dot Placement Grid (32×32)</span>
            <Badge variant="outline" className="ml-2">
              {coordinates.length} dots placed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div 
            className="grid gap-0.5 p-4 bg-gray-50 rounded-lg shadow-inner mb-4"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              maxWidth: '600px',
              aspectRatio: '1/1'
            }}
          >
            {renderGrid()}
          </div>
          
          {session && (
            <div className="flex gap-3">
              <Button
                onClick={clearAll}
                variant="outline"
                disabled={coordinates.length === 0}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
              <Button
                onClick={submitPattern}
                disabled={isSubmitting || coordinates.length === 0}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Pattern'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coordinates Panel */}
      <Card className="w-full lg:w-80">
        <CardHeader>
          <CardTitle>Coordinates</CardTitle>
        </CardHeader>
        <CardContent>
          {coordinates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {session ? 'Click on the grid to place dots' : 'Sign in to start placing dots'}
            </p>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {coordinates.map((coord, index) => (
                  <div
                    key={`${coord.x}-${coord.y}`}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm font-mono">
                      ({coord.x}, {coord.y})
                    </span>
                    <span className="text-xs text-gray-500">
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
  )
}
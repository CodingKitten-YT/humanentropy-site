'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, MousePointer } from 'lucide-react'

export default function AuthPrompt() {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <MousePointer className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome to DotGrid</CardTitle>
          <CardDescription className="text-center">
            Sign in with GitHub to start creating patterns on the 32×32 grid
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800"
            size="lg"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </Button>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600">Click to place dots</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <div className="text-green-600 font-bold text-lg">32</div>
              </div>
              <p className="text-xs text-gray-600">32×32 grid canvas</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <div className="w-6 h-4 bg-purple-500 rounded"></div>
              </div>
              <p className="text-xs text-gray-600">Submit patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
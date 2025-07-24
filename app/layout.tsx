import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HumanEntropy - Help Train AI by Creating Random Patterns',
  description: 'Join an open research project studying human randomness. Create dot patterns on a 32×32 grid to help train machine learning models that understand human behavior patterns. Your clicks become science.',
  keywords: [
    'human randomness',
    'machine learning research',
    'pattern recognition',
    'AI training data',
    'open research project',
    'dot patterns',
    'behavioral study',
    'entropy research',
    'crowdsourced data',
    'GitHub login'
  ],
  authors: [{ name: 'HumanEntropy Research Project' }],
  creator: 'HumanEntropy Research Project',
  publisher: 'HumanEntropy Research Project',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://didactic-space-sniffle-9v55vxpq765fp646-3000.app.github.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HumanEntropy - Help Train AI by Creating Random Patterns',
    description: 'Join an open research project studying human randomness. Create dot patterns to help train ML models that understand human behavior. Your clicks become science.',
    url: 'https://didactic-space-sniffle-9v55vxpq765fp646-3000.app.github.dev',
    siteName: 'HumanEntropy',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HumanEntropy - Open Research Project on Human Randomness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HumanEntropy - Help Train AI by Creating Random Patterns',
    description: 'Join an open research project studying human randomness. Create dot patterns to help train ML models.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'verification-code',
    // bing: 'verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={null}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
              {children}
            </div>
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - HumanEntropy',
  description: 'Sign in with GitHub to start contributing patterns to the HumanEntropy research project. Help train AI models to understand human randomness.',
  keywords: [
    'login',
    'GitHub OAuth',
    'contribute to research',
    'AI training data',
    'pattern creation access'
  ],
  openGraph: {
    title: 'Login - HumanEntropy',
    description: 'Sign in with GitHub to start contributing patterns to the HumanEntropy research project.',
    url: '/login',
  },
  twitter: {
    title: 'Login - HumanEntropy',
    description: 'Sign in with GitHub to start contributing patterns to the HumanEntropy research project.',
  },
  robots: {
    index: false, // Don't index login pages
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

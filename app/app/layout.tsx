import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Patterns - HumanEntropy',
  description: 'Create dot patterns on a 32×32 grid to contribute to machine learning research. Your patterns help train AI models to understand human randomness.',
  keywords: [
    'pattern creator',
    'dot grid',
    'AI training',
    'machine learning data',
    'human randomness study',
    'research contribution'
  ],
  openGraph: {
    title: 'Create Patterns - HumanEntropy',
    description: 'Create dot patterns on a 32×32 grid to contribute to machine learning research.',
    url: '/app',
  },
  twitter: {
    title: 'Create Patterns - HumanEntropy',
    description: 'Create dot patterns on a 32×32 grid to contribute to machine learning research.',
  },
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

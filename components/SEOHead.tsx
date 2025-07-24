import Script from 'next/script'

interface SEOHeadProps {
  title?: string
  description?: string
  path?: string
}

export default function SEOHead({ 
  title = 'HumanEntropy - Help Train AI by Creating Random Patterns',
  description = 'Join an open research project studying human randomness. Create dot patterns on a 32×32 grid to help train machine learning models that understand human behavior patterns.',
  path = '/'
}: SEOHeadProps) {
  const baseUrl = 'https://didactic-space-sniffle-9v55vxpq765fp646-3000.app.github.dev'
  const fullUrl = `${baseUrl}${path}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HumanEntropy',
    description: 'An open research project studying human randomness patterns through interactive dot grid creation to train machine learning models.',
    url: baseUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    creator: {
      '@type': 'Person',
      name: 'HumanEntropy Research Project',
      description: 'A 15-year-old developer studying human randomness patterns'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Researchers, Students, AI Enthusiasts, Open Source Contributors'
    },
    educationalUse: 'Research, Machine Learning, Pattern Recognition',
    keywords: 'human randomness, machine learning, pattern recognition, AI training data, open research',
    isAccessibleForFree: true,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/CreateAction',
      userInteractionCount: 'Variable - depends on user contributions'
    },
    featureList: [
      'Interactive 32×32 dot grid pattern creator',
      'Real-time pattern analysis and statistics',
      'Community leaderboard and pattern sharing',
      'GitHub OAuth authentication',
      'Open dataset contribution',
      'Pattern feature extraction (clustering, symmetry, density)'
    ],
    softwareVersion: '0.1.0',
    applicationSubCategory: 'Research Tool',
    screenshot: `${baseUrl}/logo.svg`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1'
    }
  }

  return (
    <>
      {/* Structured Data */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="HumanEntropy" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Academic/Research Meta Tags */}
      <meta name="citation_title" content="HumanEntropy: A Crowdsourced Study of Human Randomness Patterns" />
      <meta name="citation_author" content="HumanEntropy Research Project" />
      <meta name="citation_publication_date" content="2025" />
      <meta name="citation_online_date" content="2025" />
      <meta name="citation_language" content="en" />
      <meta name="citation_keywords" content="human randomness, machine learning, pattern recognition, crowdsourcing, behavioral study" />
      <meta name="citation_abstract_html_url" content={fullUrl} />
      
      {/* Open Graph Additional Tags */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="HumanEntropy - Interactive pattern creator for AI research" />
      <meta property="article:author" content="HumanEntropy Research Project" />
      <meta property="article:section" content="Research" />
      <meta property="article:tag" content="machine learning" />
      <meta property="article:tag" content="human behavior" />
      <meta property="article:tag" content="open source" />
      <meta property="article:tag" content="research" />
      
      {/* Additional Twitter Meta */}
      <meta name="twitter:site" content="@humanentropy" />
      <meta name="twitter:creator" content="@humanentropy" />
      <meta name="twitter:domain" content="didactic-space-sniffle-9v55vxpq765fp646-3000.app.github.dev" />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.github.com" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />
    </>
  )
}

import dynamic from 'next/dynamic'

// Force client-side rendering for this page
const AppPage = dynamic(() => import('./AppPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading app...</p>
      </div>
    </div>
  )
})

export default AppPage

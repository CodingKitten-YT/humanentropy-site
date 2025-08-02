// Login page removed - no authentication required
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Login Required</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You can now create patterns directly without signing in.
        </p>
        <a href="/app" className="text-blue-500 hover:underline">
          Go to Pattern Creator
        </a>
      </div>
    </div>
  )
}
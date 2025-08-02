// AuthProvider removed - no authentication needed
export default function AuthProvider({ 
  children 
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
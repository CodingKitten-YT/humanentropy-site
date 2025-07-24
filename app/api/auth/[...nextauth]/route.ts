import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect called with:', { url, baseUrl })
      
      // Handle signout - always go to homepage
      if (url.includes('signout') || url.includes('/api/auth/signout')) {
        console.log('Redirecting after signout to:', baseUrl)
        return baseUrl
      }
      
      // Handle signin callback - go to app page on first login
      if (url.includes('callback') && url.includes('github')) {
        console.log('Redirecting after GitHub login to: /app')
        return `${baseUrl}/app`
      }
      
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      // Allow same origin URLs
      if (new URL(url).origin === baseUrl) {
        return url
      }
      
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',  // Redirect to login page for sign-in
    error: '/login',   // Redirect to login page on error  
    signOut: '/',      // Redirect to homepage after sign-out
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
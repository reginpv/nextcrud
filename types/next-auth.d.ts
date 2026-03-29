// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: string | null
      image?: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role?: string
    image?: string
  }

  interface JWT {
    id: string
    role?: string
    image?: string
  }
}

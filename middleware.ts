export { default } from 'next-auth/middleware'
import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'

interface Token extends JWT {
  role?: number
}

export async function middleware(req: NextRequest) {
  const token: Token | null = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/app/:path*', // Add api routes here?
  ],
}

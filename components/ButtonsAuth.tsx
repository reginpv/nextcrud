'use client'

import { signIn, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function ButtonSignIn({
  className,
  label = 'Login',
}: {
  className?: string
  label?: string
}) {
  return (
    <button type="button" className={`button ${className}`} onClick={() => signIn()}>
      {label}
    </button>
  )
}

export function ButtonSignOut({ className }: { className?: string }) {
  return (
    <button
      onClick={() => {
        signOut()
      }}
      className={`button w-full justify-start ${className}`}
    >
      <LogOut className="inline mr-2 mb-1" />
      Logout
    </button>
  )
}

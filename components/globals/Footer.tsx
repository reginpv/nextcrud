'use client'

import { APP_NAME } from '@/config/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-200">
      <div className="container">
        <p className="text-sm font-normal text-center">
          {APP_NAME} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

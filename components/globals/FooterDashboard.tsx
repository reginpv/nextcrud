'use client'

import { APP_NAME } from '@/config/constants'

export default function FooterDashboard() {
  return (
    <footer className="bg-gray-200">
      <div className="py-3 px-5">
        <p className="text-sm text-gray-500 font-normal text-center">
          {APP_NAME} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

'use client'

import { useDrawer } from '@/store/useDrawer'
import Link from 'next/link'
import { SCHOOL_NAME } from '@/config/constants'
import { X } from 'lucide-react'

export default function Drawer() {
  // Store
  const open = useDrawer((state) => state.show)
  const toggle = useDrawer((state) => state.toggleShow)

  return (
    <div
      className={`${
        open ? 'w-64 z-10 opacity-100' : 'w-0 -z-0 opacity-0'
      } fixed top-0 left-0 h-dvh max-w-64 animated overflow-hidden bg-gray-200 dark:bg-gray-900 dark:text-white`}
    >
      {/* Header */}
      <div className="min-w-64 px-5 border-b border-gray-300 dark:border-gray-800 border-r">
        <div className="flex items-center justify-between gap-3 h-16">
          <h1 className="">
            <Link href="/">{SCHOOL_NAME}</Link>
          </h1>

          <button className="button button--circle -mr-3">
            <X onClick={toggle} />
          </button>
        </div>
      </div>
    </div>
  )
}

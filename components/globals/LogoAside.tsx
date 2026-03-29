'use client'

import Link from 'next/link'
import { SCHOOL_NAME } from '@/config/constants'
import { Menu } from 'lucide-react'
import { useAside } from '@/store/useAside'

export default function LogoAside() {
  // Store
  const toggleMinimize = useAside((state) => state.toggleMinimize)
  const minimize = useAside((state) => state.minimize)

  return (
    <div className="font-bold px-5 py-2 h-16 flex items-center justify-between gap-1 border-b border-gray-200 dark:border-gray-900">
      {!minimize && (
        <Link href="/" className="truncate">
          {SCHOOL_NAME}
        </Link>
      )}
      <button onClick={toggleMinimize} className="button button--circle">
        <Menu size={24} />
      </button>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ButtonSignOut } from '@/components/ButtonsAuth'
import Mode from '@/components/Mode'
import { User, UserPen, CircleUserRound, ShieldEllipsis } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function DrawerProfile() {
  // Ref
  const drawerRef = useRef<HTMLDivElement>(null)

  // Hooks
  const { data: session } = useSession()
  console.log('DrawerProfile - Session data:', session)

  // State
  const [isOpen, setIsOpen] = useState(false)

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={drawerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="button button--circle"
      >
        <User />
      </button>
      {isOpen && (
        <div className="animated absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-900 rounded z-10">
          <div className="px-2 py-3 border-b border-gray-200 dark:border-gray-900 flex gap-2">
            <div className="min-w-8">
              {session?.user?.image ? (
                <Image
                  src={session?.user?.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <CircleUserRound size={28} className="inline mr-2 mb-1" />
              )}
            </div>
            <div>
              <p>{session?.user?.name}</p>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col justify-center py-3 px-1">
            <Link
              href="/dashboard/user/profile"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded animated"
              onClick={() => setIsOpen(!isOpen)}
            >
              <UserPen className="inline mr-2 mb-1" />
              Profile
            </Link>

            <Link
              href="/dashboard/user/security"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded animated"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ShieldEllipsis className="inline mr-2 mb-1" />
              Security
            </Link>

            <Mode setIsOpen={setIsOpen} />
            <ButtonSignOut />
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useMode } from '@/store/useMode'
import { Moon } from 'lucide-react'

export default function Mode({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void
}) {
  // Store
  const { toggleMode } = useMode()

  return (
    <button
      onClick={() => {
        toggleMode()
        setIsOpen(false)
      }}
      className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded animated w-full text-left"
    >
      <Moon className="inline mr-2 mb-1" />
      Mode
    </button>
  )
}

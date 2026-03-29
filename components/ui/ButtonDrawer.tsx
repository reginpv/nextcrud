'use client'

import { Menu } from 'lucide-react'
import { useDrawer } from '@/store/useDrawer'

export default function ButtonDrawer() {
  // Store
  const toggleShow = useDrawer((state) => state.toggleShow)

  return (
    <button
      onClick={toggleShow}
      className=" button button--circle md:!hidden -ml-3"
    >
      <Menu className="inline" />
    </button>
  )
}

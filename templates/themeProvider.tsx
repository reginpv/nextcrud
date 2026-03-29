// components/ThemeProvider.tsx
"use client"

import { useEffect } from "react"
import { useMode } from "@/store/useMode"

export default function ThemeProvider({ children }: { children: React.ReactNode }){
  const { mode } = useMode()

  useEffect(() => {
    if (mode === "dark") {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [mode])

  return <>{children}</>
}
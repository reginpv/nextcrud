import { Metadata } from 'next'
import { ReactNode } from 'react'
import TemplateDashboard from '@/templates/Dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

export default function BlankLayout({ children }: { children: ReactNode }) {
  return <TemplateDashboard>{children}</TemplateDashboard>
}

import { Metadata } from 'next'
import { ReactNode } from 'react'
import TemplateBlank from '@/templates/Blank'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password: Reset your password',
}

export default function BlankLayout({ children }: { children: ReactNode }) {
  return <TemplateBlank>{children}</TemplateBlank>
}

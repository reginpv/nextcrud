import ThemeProvider from './themeProvider'
import HeaderDashboard from '@/components/globals/HeaderDashboard'
import FooterDashboard from '@/components/globals/FooterDashboard'
import Aside from '@/components/globals/Aside'
import Drawer from '@/components/globals/Drawer'

export default async function TemplateDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <section className="flex h-dvh">
        <Aside />
        <main className="dark:bg-gray-800 dark:text-white flex flex-col">
          <HeaderDashboard />
          <section className="flex-1">{children}</section>
          <FooterDashboard />
        </main>
      </section>
      <Drawer />
    </ThemeProvider>
  )
}

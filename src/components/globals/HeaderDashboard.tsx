import Link from 'next/link'
import { APP_NAME } from '@/config/constants'
import DrawerProfile from '@/components/globals/DrawerProfile'
import ButtonDrawer from '@/components/ui/ButtonDrawer'

export default async function HeaderDashboard() {
  return (
    <header className="bg-gray-200 dark:bg-gray-900 dark:text-white sticky top-0 z-10">
      <div className="px-5 py-2 h-16 flex items-center justify-between">
        <div className="flex justify-between items-center gap-5 w-full">
          <div className="flex items-center gap-3">
            <ButtonDrawer />

            <h1 className="">
              <Link href="/">{APP_NAME}</Link>
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <DrawerProfile />
          </div>
        </div>
      </div>
    </header>
  )
}

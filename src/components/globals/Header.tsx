import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { APP_NAME } from '@/config/constants'
import DrawerProfile from '@/components/globals/DrawerProfile'
import ButtonDrawer from '@/components/ui/ButtonDrawer'

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="bg-secondary sticky top-0 z-10">
      <div className="px-5 py-2 h-16 flex items-center justify-between">
        <div className="flex justify-between items-center gap-5 w-full">
          <div className="flex items-center gap-3">
            <ButtonDrawer />

            <h1 className="">
              <Link href="/">{APP_NAME}</Link>
            </h1>
          </div>

          <div className="flex items-center gap-5">
            {session ? (
              <DrawerProfile />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signup" className="button">
                  Sign In
                </Link>
                <Link href="/login" className="button button--outline">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { APP_NAME } from '@/config/constants'
import DrawerProfile from '@/components/globals/DrawerProfile'

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="bg-gray-200 dark:bg-gray-900 dark:text-white">
      <div className="h-16">
        <div className="flex justify-between items-center gap-5">
          <h1>
            <Link href="/">{APP_NAME}</Link>
          </h1>

          <div className="flex items-center gap-5">
            {session ? (
              <div className="flex items-center gap-5">
                <ul>
                  <li>
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                </ul>
                <DrawerProfile />
              </div>
            ) : (
              <div>
                <Link href="/login">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

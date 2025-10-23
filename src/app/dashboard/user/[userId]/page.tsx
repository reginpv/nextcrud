import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getUser } from '@/lib/actions/user'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'User',
  description: 'User',
}

export default async function DashboardUserPage() {
  const session = await getServerSession(authOptions)
  const res = await getUser(session.user.id)
  const user = res.success ? res.payload : null

  !user && redirect('/login')

  return (
    <section>
      <div className="">
        <div className="flex flex-col gap-5">
          <h1>User</h1>

          {session && (
            <div>
              <p>Hello {session.user.name}, you are now logged in.</p>
              <p></p>
            </div>
          )}

          {user && (
            <div>
              <p className="font-bold">Your details:</p>
              <p>ID: {user.id}</p>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>CreatedAt: {new Date(user.createdAt).toDateString()}</p>
              <p>
                LoggedInAt: {new Date(user.loggedInAt).toDateString()}{' '}
                {new Date(user.loggedInAt).toTimeString()}
              </p>
              <hr />
              {JSON.stringify(session, null, 2)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

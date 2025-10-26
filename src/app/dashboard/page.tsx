import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getUser } from '@/lib/actions/user'

export const metadata: Metadata = {
  title: 'User',
  description: 'User',
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const res = await getUser(session.user.id)
  const user = res.payload

  return (
    <section>
      <div className="">
        <div className="flex flex-col gap-5 container">
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
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

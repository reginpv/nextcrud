import TemplateDefault from '@/templates/Default'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <TemplateDefault>
      <section className="h-full">
        <div className="container">
          <div className="flex flex-col gap-5">
            <h1>Home</h1>

            {session && (
              <div>Hello {session.user.name}, you are now logged in.</div>
            )}

            <div>
              <p>
                This is a demo project built with Next.js 15, Neon PostgreSQL,
                Prisma, and Tailwind CSS V4, deployed on Vercel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </TemplateDefault>
  )
}

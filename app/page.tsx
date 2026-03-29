import TemplateDefault from '@/templates/Default'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { APP_NAME } from '@/config/constants'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <TemplateDefault>
      <section className="h-full">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <h1>{APP_NAME}</h1>

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

import FormProfile from '@/components/forms/FormProfile'
import { redirect } from 'next/navigation'
import { getMe } from '@/lib/actions/me'
import FormSecurity from '@/components/forms/FormSecurity'

export default async function DashboardUserSecurityPage() {
  // Me
  const resMe = await getMe()
  const me = resMe.success ? resMe.payload : null

  !me && redirect('/')

  return (
    <section className="main flex flex-col">
      {/** Top */}
      <div className="main__header font-semibold py-3 px-5 border-b bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-100 dark:border-gray-900">
        Security
      </div>

      {/** Content */}
      <div className="main__content py-3 px-5">
        <div className="container container--narrow md:my-5">
          <FormSecurity className="w-full max-w-80" />
        </div>
      </div>
    </section>
  )
}

'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createUser } from '@/lib/actions/user'
import { useRouter } from 'next/navigation'

export default function FormSignup({ className }: { className?: string }) {
  // Hooks
  const { push: redirect } = useRouter()

  //
  const formRef = useRef<HTMLFormElement>(null)

  // States
  const [state, handleSubmit, pending] = useActionState(createUser, {})

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      // Use delay 1000 to show form message before redirect
      setTimeout(() => {
        redirect('/login')
      }, 1000)
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      noValidate
      className={`flex flex-col gap-5 ${className}`}
    >
      <div className="form-control">
        <label>Full name</label>
        <input
          required
          type="text"
          name="name"
          placeholder="John Thomas"
          className={`input w-full`}
        />
        {state?.errors?.name && <p className="error">{state?.errors?.name}</p>}
      </div>

      <div className="form-control">
        <label>Email address</label>
        <input
          required
          type="email"
          name="email"
          placeholder="johnthomas@email.com"
          className={`input w-full`}
        />
        {state?.errors?.email && (
          <p className="error">{state?.errors?.email}</p>
        )}
      </div>
      <div className="form-control">
        <label>Password</label>
        <input
          required
          type="password"
          name="password"
          placeholder="********"
          className={`input w-full`}
        />
        {state?.errors?.password && (
          <p className="error">{state?.errors?.password}</p>
        )}
      </div>
      <div>
        {state?.message && (
          <div
            className={`alert ${
              state.success ? `alert--success` : `alert--danger`
            }`}
          >
            {state?.message}
          </div>
        )}
        <button type="submit" className="w-full my-3" disabled={pending}>
          {pending ? 'Please wait...' : 'Signup'}
        </button>
      </div>
    </form>
  )
}

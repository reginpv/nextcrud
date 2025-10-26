'use client'

import { useEffect, useState, useRef, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPassword } from '@/lib/actions/util'

export default function FormResetPassword({
  className,
}: {
  className: string
}) {
  // Params
  const searchParams = useSearchParams()

  // Refs
  const formRef = useRef<HTMLFormElement>(null)

  // State
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')

  const [state, handleSubmit, isPending] = useActionState(resetPassword, {
    success: false,
    message: null,
    errors: null,
  })

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')

    if (tokenParam && emailParam) {
      setToken(tokenParam)
      setEmail(emailParam)
    }
  }, [searchParams])

  //if no token and email return:
  if (!email && !token) {
    return (
      <div className="boreder-black m-auto w-full max-w-lg space-y-14">
        <div className="space-y-6">
          <h1 className="text-left text-3xl font-bold">
            Reset password invalid link!
          </h1>
          <p className="text-muted-foreground text-left">
            Please check your email for the reset password link.
          </p>
        </div>
        <Link href="/login" className="button button--default">
          Go back to Homepage
        </Link>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      noValidate
      data-loading={isPending}
      className={`flex flex-col gap-5 ${className}`}
    >
      <div className="w-full form-control">
        <label className="auth-label" htmlFor="email">
          Email*
        </label>
        <input
          required
          className={`${
            !state?.success && state?.errors?.includes('email')
              ? 'has-errors'
              : 'border-gray-400 text-gray-400'
          } auth-input w-full`}
          type="email"
          name="email"
          value={email}
          readOnly
        />
      </div>

      <div className="w-full form-control">
        <span className="flex flex-row justify-between">
          <label className="auth-label" htmlFor="password">
            Password*{' '}
          </label>
        </span>
        <input
          required
          className={`${
            !state?.success && state?.errors?.password
              ? 'has-errors'
              : 'border-black'
          } auth-input w-full`}
          name="password"
          type="password"
          placeholder="********"
        />
        {/* Field Alert */}
        {state?.errors?.password && (
          <div className="error text-red-500 text-[12px] font-semibold">
            {' '}
            {state?.errors?.password}{' '}
          </div>
        )}
      </div>

      <div className="w-full form-control">
        <span className="flex flex-row justify-between">
          <label className="auth-label" htmlFor="confirmpassword">
            Confirm Password*{' '}
          </label>
        </span>
        <input
          required
          className={`${
            !state?.success && state?.errors?.confirmpassword
              ? 'has-errors'
              : 'border-black'
          } auth-input w-full`}
          name="confirmPassword"
          type="password"
          placeholder="********"
        />
        {/* Field Alert */}
        {state?.errors?.confirmpassword && (
          <div className="error text-red-500 text-[12px] font-semibold">
            {' '}
            {state?.errors?.confirmpassword}{' '}
          </div>
        )}
      </div>

      {/* Alert */}
      {state.message && (
        <div
          className={`alert ${
            state.success ? 'alert--success' : 'alert--danger'
          }`}
        >
          {state.message}
        </div>
      )}

      {/** Hiddens */}
      <input type="hidden" name="token" value={token} />

      <div>
        <button
          type="submit"
          className="w-full disabled:animate-pulse disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Please wait...' : 'Reset Password'}
        </button>
      </div>
    </form>
  )
}

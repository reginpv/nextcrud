'use client'

import { useState, useRef, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { forgotPassword } from '@/lib/actions/util'

export default function FormForgotPassword({
  className,
}: {
  className: string
}) {
  const router = useRouter()

  const { push: redirect } = router
  const formRef = useRef<HTMLFormElement>(null)

  const [state, handleSubmit, isPending] = useActionState(forgotPassword, {
    success: false,
    message: null,
    errors: null,
  })

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      data-animate-pulse={isPending}
      noValidate
      className={`${className} flex flex-col gap-5`}
    >
      <div className="form-control">
        <label className="auth-label" htmlFor="email">
          Email*
        </label>

        <input
          required
          className={`w-full ${
            !state?.success && state?.errors?.email
              ? 'has-errors'
              : 'border-black'
          } auth-input `}
          type="email"
          name="email"
          placeholder="johnthomas@email.com"
        />

        {/* Field Alert */}
        {state?.errors?.email && (
          <p className="error">{state?.errors?.email}</p>
        )}
      </div>

      {/* Alert */}
      {state && state.message && (
        <div
          className={`alert ${
            state.success ? 'alert--success' : 'alert--danger'
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full disabled:animate-pulse disabled:opacity-50 my-3"
          disabled={isPending}
        >
          {isPending ? 'Please wait...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

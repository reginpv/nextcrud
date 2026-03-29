'use client'

import { useRef, useActionState } from 'react'
import { updateMePassword } from '@/lib/actions/me'

export default function FormSecurity({ className }: { className?: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  const [state, handleSubmit, isPending] = useActionState(updateMePassword, {
    success: false,
    message: null,
    errors: null,
  })

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className={`bg-white p-5 md:p-10 mx-auto flex justify-center ${className}`}
      noValidate
      data-loading={isPending}
    >
      <div className="form__content">
        <div className=" flex flex-col gap-5">
          <div className="form-control">
            <label htmlFor="new_password">New Password*</label>
            <div className="relative w-full ">
              <input
                required
                name="new_password"
                type="password"
                className={`w-full ${
                  state.errors?.new_password ? 'has-errors' : ''
                }`}
                placeholder="**************"
              />
            </div>
            {/* Field Alert */}
            {state.errors?.new_password && (
              <div className="error">{state.errors.new_password}</div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="confirm_password">Confirm Password*</label>
            <div className="relative w-full ">
              <input
                required
                name="confirm_password"
                type="password"
                className={`w-full ${
                  state.errors?.confirm_password ? 'has-errors' : ''
                }`}
                placeholder="**************"
              />
            </div>
            {/* Field Alert */}
            {state.errors?.confirm_password && (
              <div className="error">{state.errors.confirm_password}</div>
            )}
          </div>

          {state.message && (
            <div
              className={`alert ${
                state.success ? 'alert--success' : 'alert--danger'
              }`}
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            className={`button button--default flex justify-center ${
              isPending ? 'cursor-wait opacity-50' : 'cursor-pointer'
            }`}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
}

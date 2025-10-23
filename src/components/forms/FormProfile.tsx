'use client'

import { useEffect, useState, useActionState, useRef } from 'react'
import { updateMe } from '@/lib/actions/me'
import { useSession } from 'next-auth/react'
import { User } from 'lucide-react'
import { Check } from 'lucide-react'

export default function FormProfile({ m }: { m: User }) {
  //
  const { data: session, update } = useSession()

  //
  const formRef = useRef<HTMLFormElement>(null)

  const [pending, setPending] = useState(false)
  const [me, setMe] = useState<User>(m)
  const [state, handleSubmit, isPending] = useActionState(updateMe, {
    success: false,
    message: null,
    errors: null,
  })

  //
  useEffect(() => {
    setMe(m)
  }, [])

  //
  useEffect(() => {
    console.log('FormProfile - State changed:', state)
    if (state.success) {
      setMe(state.payload)
      sessionUpdate(state.payload)
    }
  }, [state])

  //
  async function sessionUpdate(updatedUser: User) {
    // Merge updated user data with existing session user data
    // Just pass the user fields that have changed
    const newUser = {
      ...session?.user,
      ...updatedUser,
    }
    console.log('Updating session with new user data:', newUser)

    // Update client side state in memory
    // Update() does not modify the JWT token
    await update(newUser)
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white p-5 md:p-10 w-auto max-w-[680px] mx-auto flex justify-center dark:bg-gray-800"
      noValidate
      data-loading={pending || isPending}
    >
      <div className="flex flex-col gap-5">
        {/* Profile Picture Editor */}
        <div className=" p-[15px] relative flex justify-center text-center">
          <div className=" w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden">
            <label htmlFor="profile-image-input" className="cursor-pointer">
              <User className="w-full h-full object-cover text-gray-900" />
            </label>
            <input
              id="profile-image-input"
              type="file"
              accept=".jpg, .jpeg, .png"
              className="hidden"
              name="image"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setMe((prev: User) => ({
                      ...prev,
                      image: reader.result as string,
                    }))
                  }
                  reader.readAsDataURL(file)
                }
              }}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-information-container mb-[40px] w-full flex flex-col gap-y-[16px]">
          {/* Name */}
          <div className="form-control">
            <label htmlFor="name">Name</label>
            <div className="flex relative">
              <input
                type="text"
                name="name"
                defaultValue={me?.name}
                className={`!w-full ${state.errors?.name ? 'has-errors' : ''}`}
                disabled={isPending}
              />
            </div>
            {/* Field Alert */}
            {state.errors?.name && (
              <div className="error">{state.errors.name}</div>
            )}
          </div>
          {/* Email Address */}
          <div className="form-control">
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="email"
              defaultValue={me?.email}
              className={`!w-full ${state.errors?.name ? 'has-errors' : ''}`}
            />
          </div>
          {state.message && (
            <div
              className={`alert ${
                state.success ? 'alert--success' : 'alert--fail'
              }`}
            >
              <Check className="inline mr-2" />
              {state.message}
            </div>
          )}
          {/* Save Button */}
          <button
            className={`button button--default flex justify-center my-3 ${
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

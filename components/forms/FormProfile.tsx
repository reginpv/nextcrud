'use client'

import { useEffect, useState, useActionState, useRef } from 'react'
import Image from 'next/image'
import { updateMe } from '@/lib/actions/me'
import { useSession } from 'next-auth/react'
import { UserRoundPen } from 'lucide-react'
import { Trash } from 'lucide-react'
import { deleteMedia, uploadMedia } from '@/lib/actions/media'

export default function FormProfile({
  m,
  className,
}: {
  m: User
  className?: string
}) {
  //
  const { data: session, update } = useSession()

  //
  const formRef = useRef<HTMLFormElement>(null)

  // States
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
    if (state.success) {
      setMe(state.payload)
      sessionUpdate(state.payload)
    } else {
      setPending(false)
    }
  }, [state])

  //
  async function sessionUpdate(updatedUser: User) {
    // NOTE: Important!
    // Merge updated user data with existing session user data
    // *** Just pass the user fields that have changed ***
    const newUser = {
      ...session?.user,
      ...updatedUser,
    }

    //
    console.log('Updating session with new user data:', newUser)
    await update(newUser)

    //
  }

  // Upload profile photo
  async function handleUploadProfilePhoto(imageFile: File) {
    setPending(true)

    try {
      const upload = await uploadMedia(me.id, imageFile)

      if (upload.success) {
        setMe((prev: User) => ({
          ...prev,
          image: upload.payload.url,
        }))
        //
        const update = await updateMe(
          formRef.current,
          (() => {
            const fd = new FormData()
            fd.append('name', me.name)
            fd.append('email', me.email)
            fd.append('image', upload.payload.url)
            return fd
          })()
        )
        sessionUpdate(update.payload)
      }
    } catch (error) {
      console.log('error: ', error)
    } finally {
      setPending(false)
    }
  }

  // Delete Profile Photo
  async function handleDeleteProfilePhoto() {
    setPending(true)

    // Prepare form data
    const formData = new FormData()
    formData.append('name', me.name)
    formData.append('email', me.email)
    formData.append('image', me.image)
    formData.append('removeProfile', 'true')

    try {
      //
      const update = await Promise.all([
        deleteMedia(formRef.current, formData),
        updateMe(formRef.current, formData),
      ])

      if (update[0].success) {
        setMe((prev: User) => ({
          ...prev,
          image: null,
        }))
        sessionUpdate(update[1].payload)
      }

      console.log('update: ', update)
    } catch (error) {
      console.log('error: ', error)
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className={`bg-white p-5 md:p-10 mx-auto flex justify-center dark:bg-gray-800 ${className}`}
      noValidate
      data-loading={pending || isPending}
    >
      <div className="flex flex-col gap-5">
        {/* Profile Picture Editor */}

        <div className="p-4 relative flex justify-center text-center">
          <div className=" w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex justify-center items-center mx-auto">
            <label
              data-loading={pending}
              htmlFor="profile-image-input"
              className="cursor-pointer h-full flex items-center w-full justify-center"
            >
              {me?.image ? (
                <div className="relative group h-full w-full">
                  <Image
                    src={me.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                  />
                  <div className="bg-black/30 z-20 overlay absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity">
                    <button
                      type="button"
                      onClick={handleDeleteProfilePhoto}
                      className="button button--circle"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ) : (
                <UserRoundPen size={34} className=" text-gray-900" />
              )}
            </label>
            <input
              id="profile-image-input"
              type="file"
              accept=".jpg, .jpeg, .png"
              className="hidden"
              name="_image"
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
                  handleUploadProfilePhoto(file)
                }
              }}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-information-container mb-10 w-full flex flex-col gap-y-4">
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
          {state?.message && (
            <div
              className={`alert ${
                state.success ? 'alert--success' : 'alert--danger'
              }`}
            >
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

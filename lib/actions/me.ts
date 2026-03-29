'use server'

import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { cache } from 'react'
import { unstable_cache as nextCache, revalidateTag } from 'next/cache'
import { getServerSession, Session } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { isValidEmail } from '@/lib/helper'

const table = 'user'

// GET ME
export const getMe: User = cache(async () => {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session || !session.user || !session.user.id) {
    return {
      success: false,
      payload: null,
      message: 'User not authenticated!',
    }
  }

  const id = session?.user?.id

  const data = await nextCache(
    async () => {
      try {
        const me = await prisma[table].findFirst({
          where: {
            id: +id,
            deletedAt: null,
          },
        })

        console.log(`---DB HIT: GET ME with ID: ${id} from database---`)

        if (!me) {
          return {
            success: true,
            payload: [],
          }
        }

        return {
          success: true,
          payload: me,
          message: 'My data fetched successfully!',
        }
      } catch (error) {
        console.error('[getMe | Prisma | Error]:', error)
        return {
          success: false,
          payload: null,
          message: 'Failed to get my data!',
        }
      }
    },
    ['me', id],
    {
      tags: ['me', table, 'cache'],
    }
  )()

  return data
})

// UPDATE ME
export async function updateMe(_prevState: User, formData: FormData) {
  // Session
  const session = await getServerSession(authOptions)
  const id = session?.user?.id as string

  // Data
  const name = formData.get('name')?.toString().trim() || null
  const email = formData.get('email')?.toString().trim() || null
  const image = formData.get('image')?.toString().trim() || null
  const updatedAt = new Date()

  // Image handling
  const removeImage = formData.get('removeProfile') === 'true'

  try {
    // Prepare the update data
    let updateData: Record<string, any> = {
      updatedAt: updatedAt,
    }
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (image) updateData.image = image

    console.log('updateData: ', updateData)

    // Handle profile image removal
    if (removeImage) {
      updateData.image = null
    }

    // Improved required fields with friendly labels
    const requiredFields = [
      { key: 'name', label: 'Name', value: name },
      { key: 'email', label: 'Email', value: email },
    ]

    // Validation errors
    let errors: Record<string, string> = {}
    requiredFields.forEach(({ key, label, value }) => {
      if (!value) {
        errors[key] = `${label} is required.`
      }
    })

    // Email validation when available
    if (email && !isValidEmail(email)) {
      errors['email'] = 'Please enter a valid email address.'
    }

    // ERRORS:
    // Return errors if any exist
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
        input: {
          name,
          email,
          id,
        },
        message: null,
      }
    }

    // Check if email already exists
    const userExist = await prisma[table].findFirst({
      where: {
        email: email,
      },
    })

    // If email already exists, return error
    if (userExist) {
      if (userExist.id !== +id) {
        return {
          success: false,
          payload: null,
          message: `Email ${email} already exists. Please use a different email.`,
        }
      }
    }

    // Update me data
    const updatedUser = await prisma[table].update({
      where: {
        id: +id,
      },
      data: updateData,
    })

    revalidateTag('me')

    return {
      success: true,
      payload: updatedUser,
      message: 'Profile updated successfully!',
    }
  } catch (error) {
    console.error('lib/actions/me.ts: ', error)
    return {
      success: false,
      payload: null,
      message: 'Failed to update profile. Please call admin.',
    }
  }
}

// UPDATE ME PASSWORD
export async function updateMePassword(_prevState: User, formData: FormData) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session || !session.user || !session.user.id) {
    return {
      success: false,
      payload: null,
      message: 'User not authenticated!',
    }
  }

  const id = session.user.id

  const new_password = formData.get('new_password')?.toString().trim()
  const confirm_password = formData.get('confirm_password')?.toString().trim()

  let errors: Record<string, string> = {}

  const requiredFields = [
    { key: 'new_password', label: 'New Password', value: new_password },
    {
      key: 'confirm_password',
      label: 'Confirm Password',
      value: confirm_password,
    },
  ]

  // Check required fields
  requiredFields.forEach(({ key, label, value }) => {
    if (!value) {
      errors[key] = `${label} is required.`
    }
  })

  // Password match validation
  if (new_password !== confirm_password) {
    errors['confirm_password'] =
      'New password and confirm password do not match.'
  }

  // Password strength validation
  if (new_password && new_password.length < 8) {
    errors['new_password'] = 'New password must be at least 8 characters long.'
  }

  // Return errors if any exist
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      input: { id },
      message: null,
    }
  }

  try {
    // Hash the new password
    const hashedPassword = await hash(new_password, 12)

    // Update the user's password
    const updatedUser = await prisma[table].update({
      where: { id: +id },
      data: { password: hashedPassword, updatedAt: new Date() },
    })

    revalidateTag('me')

    return {
      success: true,
      payload: updatedUser,
      message: 'Password updated successfully.',
    }
  } catch (error) {
    console.error('[updateMePassword | Prisma | Error]:', error)
    return {
      success: false,
      payload: null,
      message: 'Failed to update password.',
    }
  }
}

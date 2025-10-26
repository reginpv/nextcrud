'use server'

import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { cache } from 'react'
import { unstable_cache as nextCache, revalidateTag } from 'next/cache'
import { getServerSession, Session } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

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

// UPDATE ONE
export async function updateMe(prevState: User, formData: User) {
  // Session
  const session = await getServerSession(authOptions)
  const id = session?.user?.id as string

  // Data
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()
  const updatedAt = new Date()

  try {
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

    const updatedUser = await prisma[table].update({
      where: {
        id: +id,
      },
      data: {
        name: name || prevState.name,
        email: email || prevState.email,
        password: password ? await hash(password, 10) : prevState.password,
        updatedAt: updatedAt,
      },
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

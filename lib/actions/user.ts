"use server"

import prisma from "@/lib/prisma"
import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"

const table = "user"

// GET ONE
// Because Session returns ID as string, we need to parse it to integer
export async function getUser(id: string) {

  try {
    const user = await prisma[table].findFirst({
      where: {
        id: +id
      }
    })

    return {
      success: true,
      payload: user
    }

  } catch (error) {
    return {
      success: false,
      payload: null,
      message: "Failed to get user"
    }
  }
  
}

// GET ALL
export async function getUsers() {

  try {
    const users = await prisma[table].findMany({
      where: {
        deletedAt: null
      }
    })

    return {
      success: true,
      payload: users
    }

  } catch (error) {
    return {
      success: false,
      payload: null,
      message: "Failed to get users"
    }
  }
  
}

// CREATE
export async function createUser(prevState: User, formData: User) {

  const name = formData.get("name")?.toString().trim()
  const email = formData.get("email")?.toString().trim()
  const password = formData.get("password")?.toString().trim()

  // Check for missing required fields
  const requiredFields = ["name", "email", "password"] as const
  type Field = typeof requiredFields[number]
  let errors: { [key in Field]?: string } = {}
  requiredFields.forEach((field) => {
    if (!formData.get(field)?.toString().trim()) {
      errors[field] = `${field} is required.`
    }
  })

  // Has error, return data
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      input: {
        name,
        email,
      }
    }
  }

  try {

    // Check if email already exists
    const userExist = await prisma[table].findFirst({
      where: {
        email: email,
      },
    })

    // If email already exists, return error
    if (userExist) {
      return { 
        success: false, 
        message: [`Email ${email} already exists.`],
        input: {
          name,
          email,
        }
      }
    }

    // Create user
    const user = await prisma[table].create({
      data: {
        name,
        email,
        password: await hash(password, 12),
      }
    })

    // Revalidate route cache
    revalidatePath("/users")

    return {
      success: true,
      message: "User created successfully",
      payload: user
    }

  } catch (error) {
    return {
      success: false,
      payload: null,
      message: "Failed to create user"
    }
  }
  
}

// DELETE
export async function deleteUser(id: string) {

  try {
    const user = await prisma[table].delete({
      where: {
        id: parseInt(id)
      }
    })

    // Revalidate route cache
    revalidatePath("/users")

    return {
      success: true,
      payload: user
    }

  } catch (error) {
    return {
      success: false,
      payload: null,
      message: "Failed to delete user"
    }
  }
  
}
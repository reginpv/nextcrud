'use server'

import { put, del } from '@vercel/blob'

// UPLOAD IMAGE
export async function uploadMedia(userId: number, image: File) {
  if (!image || image.size === 0) {
    console.error('No image provided to createMedia.')
    return null
  }

  const type = image.type

  try {
    // Convert the File object to a Buffer
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const width = 0
    const height = 0

    const blob = await put(`user/${userId}/${image.name}`, buffer, {
      access: 'public',
      contentType: image.type,
      // To avoid filename conflicts
      addRandomSuffix: true,
    })

    // If blob creation fails for some reason
    return {
      success: true,
      payload: blob,
      message: 'File uploaded successfully!',
    }
  } catch (error) {
    console.error('Error in createMedia function: ', error)
    return null // Return null on any error
  }
}

// DELETE
export async function deleteMedia(prevState: any, formData: any) {
  const url = formData.get('image')?.toString().trim()
  if (!url) {
    return {
      success: false,
      payload: null,
      message: 'URL is required',
    }
  }

  try {
    // Delete the media from the storage
    const deleted = await del(url)

    return {
      success: true,
      payload: 'Media deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting media: ', error)

    return {
      success: false,
      payload: ['Error deleting media'],
    }
  }
}

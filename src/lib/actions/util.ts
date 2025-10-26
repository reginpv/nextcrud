'use server'

import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import nodemailer from 'nodemailer'
import { defaultEmailTemplate } from '../email-templates/defaultEmailTemplate'
import {
  APP_NAME,
  APP_BASE_URL,
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,
} from '@/config/constants'
import { isValidEmail } from '../helper'

const table = 'resetPasswordToken'

export async function forgotPassword(_prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim()

  if (!email) {
    return {
      success: false,
      payload: null,
      message: 'Email is required.',
    }
  }

  if (email && !isValidEmail(email)) {
    return {
      success: false,
      payload: null,
      message: 'Please enter a valid email address.',
    }
  }

  try {
    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Generate secure reset token
      const token = Math.random().toString(36).substring(2, 10)

      // Set the expiration time (1 hour from now)
      const expires = new Date()
      expires.setHours(expires.getHours() + 1)

      // Store the reset token in the database (using upsert to handle new and existing records)
      await prisma[table].upsert({
        where: { email_token: { email, token } }, // Composite unique key (email + token)
        update: {
          token,
          expires,
        },
        create: {
          email,
          token,
          expires,
        },
      })

      // SMTP: Send an email with the reset password link
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true, //process.env.SMTP_SECURE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_KEY,
        },
      })

      const resetLink = `${APP_BASE_URL}/reset-password?token=${token}&email=${email}`
      const content = `
        <p>Hi ${email},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you!</p>
      `
      const mailOptions = {
        from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
        to: email,
        subject: `Password Reset Request - ${APP_NAME}`,
        html: defaultEmailTemplate(content),
      }

      const mail = await transporter.sendMail(mailOptions)

      console.error('Password reset email sent:', mail)

      if (!mail.accepted.length) {
        return {
          success: false,
          payload: null,
          message: 'Failed to send email.',
        }
      } else {
        return {
          success: true,
          payload: null,
          message: 'Email sent successfully.',
        }
      }
    }

    return {
      success: false,
      payload: null,
      message: 'If you have an account, please check your email.',
    }

    //
  } catch (error) {
    console.error('Error in forgotPassword function: ', error)
    return {
      success: false,
      payload: null,
      message: 'Failed to send email',
    }
  }
}

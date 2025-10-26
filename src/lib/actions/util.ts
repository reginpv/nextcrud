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

// FORGOT PASSWORD
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

// RESET PASSWORD
export async function resetPassword(_prevState: any, formData: FormData) {
  const token = formData.get('token')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()
  const confirmPassword = formData.get('confirmPassword')?.toString().trim()

  console.log('token: ', token)
  console.log('email: ', email)
  console.log('password: ', password)
  console.log('confirmPassword: ', confirmPassword)

  // Validate
  if (!token || !email || !password) {
    return {
      success: false,
      payload: null,
      message: 'All fields are required.',
    }
  }

  // Confirm
  if (password !== confirmPassword) {
    return {
      success: false,
      payload: null,
      message: 'Passwords do not match.',
    }
  }

  try {
    // Find the token in the resetpasswordtoken table
    const resetToken = await prisma[table].findUnique({
      where: { token },
    })

    console.log('reset token: ', resetToken)

    if (!resetToken || resetToken.email !== email) {
      return {
        success: false,
        payload: null,
        message: 'Invalid or expired token.',
      }
    }

    if (resetToken.expires < new Date()) {
      return {
        success: false,
        payload: null,
        message: 'Token has expired.',
      }
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12)

    // Update the user's password in the database
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Optionally, remove the reset token from the database after successful reset
    await prisma[table].delete({
      where: { token },
    })

    // SMTP: Send an email to notify user that their password has been reset
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, //process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_KEY,
      },
    })

    const content = `
			<p>Hi ${email},</p>
			<p>Your password has been successfully reset.</p>
			<p>If you did not perform this action, please contact our support team immediately.</p>
			<p>Thank you!</p>
		`

    const mailOptions = {
      from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `Password Reset Successful - ${APP_NAME}`,
      html: defaultEmailTemplate(content),
    }

    const mail = await transporter.sendMail(mailOptions)

    console.log('mail: ', mail)

    if (!mail.accepted.length) {
      return {
        sucess: false,
        payload: null,
        message: 'Failed to send email.',
      }
    } else {
      return {
        success: true,
        payload: null,
        message: 'Password reset successful.',
      }
    }

    //
  } catch (error) {
    console.error('Error in resetPassword function: ', error)

    return {
      success: false,
      payload: null,
      message: 'Failed to reset password',
    }
  }
}

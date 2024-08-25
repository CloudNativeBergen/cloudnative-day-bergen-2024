import { Session } from 'next-auth'
import { NextResponse } from 'next/server'
import {
  ProfileEmail,
  ProfileEmailResponse,
  ProfileImage,
  ProfileImageResponse,
} from '@/lib/profile/types'
import { FormValidationError } from '@/lib/proposal/types'
import { profile } from 'console'

export function defaultEmails(session: Session) {
  return [
    {
      email: session.user.email,
      verified: true,
      primary: true,
      visibility: 'private',
    },
  ]
}

export function profileEmailResponseError({
  emails,
  error,
  message,
  validationErrors,
  type = 'server',
  status = 500,
}: {
  emails: ProfileEmail[]
  error?: any
  message: string
  validationErrors?: FormValidationError[]
  type?: string
  status?: number
}) {
  if (error) {
    console.error(error)
  }

  error = { message, type, validationErrors }
  const response = new NextResponse(
    JSON.stringify({ emails, error, status } as ProfileEmailResponse),
    { status },
  )
  response.headers.set('cache-control', 'no-store')

  return response
}

export function profileEmailResponse(emails: ProfileEmail[]) {
  const response = NextResponse.json({ emails } as ProfileEmailResponse)
  return response
}

export function profileImageResponseError({
  image,
  error,
  message,
  type = 'server',
  status = 500,
}: {
  image?: ProfileImage
  error?: any
  message: string
  type?: string
  status?: number
}) {
  if (error) {
    console.error(error)
  }

  error = { message, type }
  const response = new NextResponse(
    JSON.stringify({ image, error, status } as ProfileImageResponse),
    { status },
  )
  response.headers.set('cache-control', 'no-store')

  return response
}

export function profileImageResponse(image: ProfileImage) {
  const response = NextResponse.json({ image } as ProfileImageResponse)
  return response
}

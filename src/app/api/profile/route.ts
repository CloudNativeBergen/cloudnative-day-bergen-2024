import { NextAuthRequest, auth } from '@/lib/auth'
import { getSpeaker, updateSpeaker } from '@/lib/speaker/sanity'
import { speakerResponse, speakerResponseError } from '@/lib/speaker/server'
import { convertJsonToSpeaker, validateSpeaker } from '@/lib/speaker/validation'
import { Speaker } from '@/lib/speaker/types'

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest) => {
  if (
    !req.auth ||
    !req.auth.user ||
    !req.auth.speaker ||
    !req.auth.speaker._id ||
    !req.auth.account
  ) {
    return speakerResponseError({
      message: 'Unauthorized',
      type: 'authentication',
      status: 401,
    })
  }

  const { speaker, err } = await getSpeaker(req.auth.speaker._id)
  if (err || !speaker) {
    console.error('Error fetching speaker profile', err, speaker, req.auth)
    return speakerResponseError({
      error: err,
      message: 'Failed to fetch speaker',
    })
  }

  return speakerResponse(speaker)
}) as any

export const PUT = auth(async (req: NextAuthRequest) => {
  if (
    !req.auth ||
    !req.auth.user ||
    !req.auth.speaker ||
    !req.auth.speaker._id ||
    !req.auth.account
  ) {
    return speakerResponseError({
      message: 'Unauthorized',
      type: 'authentication',
      status: 401,
    })
  }

  const data = (await req.json()) as Speaker
  const speaker = convertJsonToSpeaker(data)

  const validationErrors = validateSpeaker(speaker)
  if (validationErrors.length > 0) {
    return speakerResponseError({
      message: 'Speaker contains invalid fields',
      validationErrors,
      type: 'validation',
      status: 400,
    })
  }

  const { speaker: updatedSpeaker, err: updateErr } = await updateSpeaker(
    req.auth.speaker._id,
    speaker,
  )
  if (updateErr) {
    return speakerResponseError({
      error: updateErr,
      message: 'Error updating speaker profile in database',
      type: 'server',
      status: 500,
    })
  }

  return speakerResponse(updatedSpeaker)
}) as any

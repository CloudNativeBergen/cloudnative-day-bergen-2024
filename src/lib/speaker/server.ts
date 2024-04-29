import { FormValidationError } from "@/lib/proposal/types"
import { NextResponse } from "next/server"
import { Speaker, SpeakerResponse } from "@/lib/speaker/types"

export function speakerResponseError({ error, message, validationErrors, type = "server", status = 500 }: { error?: any, message: string, validationErrors?: FormValidationError[], type?: string, status?: number }) {
  if (error) {
    console.error(error)
  }

  const response = new NextResponse(JSON.stringify({ error: { message, type, validationErrors }, status } as SpeakerResponse), { status })
  response.headers.set('cache-control', 'no-store')

  return response
}

export function speakerResponse(speaker: Speaker) {
  const response = NextResponse.json({ speaker } as SpeakerResponse)
  response.headers.set('cache-control', 'no-store')
  if (speaker._rev) response.headers.set('etag', speaker._rev)
  if (speaker._updatedAt) response.headers.set('last-modified', new Date(speaker._updatedAt).toUTCString())
  return response
}
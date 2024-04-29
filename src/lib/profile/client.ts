import {
  Speaker,
  SpeakerResponse,
} from '@/lib/speaker/types';
import { ProfileEmailResponse } from './types';

export async function getEmails(): Promise<ProfileEmailResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/profile/emails`

  const res = await fetch(url)
  return await res.json() as ProfileEmailResponse
}

export async function getProfile(): Promise<SpeakerResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/profile`

  const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } })
  return await res.json() as SpeakerResponse
}

export async function putProfile(speaker: Speaker): Promise<SpeakerResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/profile`
  let method = 'PUT'

  const res = await fetch(url, {
    next: { revalidate: 0 },
    cache: 'no-store',
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(speaker),
  });

  return await res.json() as SpeakerResponse
}
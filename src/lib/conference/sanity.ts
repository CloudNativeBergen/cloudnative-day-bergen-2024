import { clientWrite } from '../sanity/client'
import { Conference } from './types'

const revalidate = 3600

export async function getConferenceForDomain(
  domain: string,
): Promise<{ conference: Conference; error: Error | null }> {
  let conference = {} as Conference
  let error = null

  try {
    conference = await clientWrite.fetch(
      `*[ _type == "conference" && $domain in domains][0]{
      ...,
      organizers[]->{
      ...,
      "image": image.asset->url
      }
    }`,
      { domain },
      {
        next: {
          revalidate: revalidate,
        },
      },
    )
  } catch (err) {
    error = err as Error
  }

  return { conference, error }
}

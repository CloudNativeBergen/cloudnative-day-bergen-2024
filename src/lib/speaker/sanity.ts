import { Speaker } from "@/types/proposal";
import { clientWrite } from "../sanity/client";
import { randomUUID } from "crypto";

export async function getOrCreateSpeaker(user: { name: string, email: string }): Promise<{ speaker: Speaker; err: Error | null; }> {
  let speaker = {} as Speaker
  let err = null

  try {
    speaker = await clientWrite.fetch(`*[ _type == "speaker" && email==$email ][0]`, { email: user.email })
  } catch (error) {
    err = error as Error
  }

  if (!speaker?._id) {
    speaker = {
      _id: randomUUID(),
      email: user.email,
      name: user.name,
      is_diverse: false,
      is_first_time: false,
      is_local: false,
    } as Speaker
    try {
      speaker = await clientWrite.create({ _type: "speaker", ...speaker }) as Speaker
    } catch (error) {
      err = error as Error
    }
  }

  return { speaker, err }
}

export async function getSpeaker(email: string): Promise<{ speaker: Speaker; err: Error | null; }> {
  let speaker: Speaker = {} as Speaker
  let err = null

  try {
    speaker = await clientWrite.fetch(`*[ _type == "speaker" && email==$email ][0]`, { email })
  } catch (error) {
    err = error as Error
  }

  return { speaker, err }
}

export async function updateSpeaker(spekaerId: string, speaker: Speaker, email: string): Promise<{ speaker: Speaker; err: Error | null; }> {
  let err = null

  // Ensure the email is updated to match the user's email
  speaker.email = email

  try {
    speaker = await clientWrite.patch(spekaerId).set(speaker).commit()
  } catch (error) {
    err = error as Error
  }

  return { speaker, err }
}

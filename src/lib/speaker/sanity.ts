import { Speaker } from "@/lib/speaker/types";
import { clientReadUncached as clientRead, clientWrite, clientReadCached } from "@/lib/sanity/client";
import { randomUUID } from "crypto";
import { Account, User } from "next-auth";

export function providerAccount(provider: string, providerAccountId: string): string {
  return `${provider}:${providerAccountId}`
}

export async function getOrCreateSpeaker(user: User, account: Account): Promise<{ speaker: Speaker; err: Error | null; }> {
  let speaker = {} as Speaker
  let err = null

  const provider = providerAccount(account.provider, account.providerAccountId)

  try {
    speaker = await clientRead.fetch(`*[ _type == "speaker" && $provider in providers][0]`, { provider }, { cache: "no-store" })
  } catch (error) {
    err = error as Error
  }

  if (!speaker?._id) {
    speaker = {
      _id: randomUUID(),
      email: user.email,
      name: user.name,
      imageURL: user.image || "",
      providers: [provider],
    } as Speaker
    try {
      speaker = await clientWrite.create({ _type: "speaker", ...speaker }) as Speaker
    } catch (error) {
      err = error as Error
    }
  }

  return { speaker, err }
}

export async function getSpeaker(speakerId: string): Promise<{ speaker: Speaker; err: Error | null; }> {
  let speaker: Speaker = {} as Speaker
  let err = null

  try {
    speaker = await clientRead.fetch(`*[ _type == "speaker" && _id == $speakerId][0]`, { speakerId }, { cache: "no-store" })
  } catch (error) {
    err = error as Error
  }

  return { speaker, err }
}

export async function updateSpeaker(spekaerId: string, speaker: Speaker): Promise<{ speaker: Speaker; err: Error | null; }> {
  let err = null

  try {
    speaker = await clientWrite.patch(spekaerId).set(speaker).commit()
  } catch (error) {
    err = error as Error
  }

  return { speaker, err }
}

export async function getOrganizers(): Promise<{ organizers: Speaker[]; err: Error | null; }> {
  let organizers: Speaker[] = []
  let err = null

  try {
    organizers = await clientReadCached.fetch(`*[ _type == "speaker" && is_organizer == true ]{
      name, title, links, "image": image.asset->url
    }`)
  } catch (error) {
    err = error as Error
  }

  return { organizers, err }
}
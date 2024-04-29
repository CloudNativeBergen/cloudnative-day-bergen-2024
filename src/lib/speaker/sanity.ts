import { Speaker } from "@/lib/speaker/types";
import { clientRead, clientWrite } from "@/lib/sanity/client";
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
    speaker = await clientWrite.fetch(`*[ _type == "speaker" && $provider in providers][0]`, { provider })
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
      speaker = await clientWrite.create({ _type: "speaker", providers: [provider], ...speaker }) as Speaker
    } catch (error) {
      err = error as Error
    }
  }

  return { speaker, err }
}

export async function getSpeaker(account: Account): Promise<{ speaker: Speaker; err: Error | null; }> {
  let speaker: Speaker = {} as Speaker
  let err = null

  const provider = providerAccount(account.provider, account.providerAccountId)

  try {
    speaker = await clientWrite.fetch(`*[ _type == "speaker" && $provider in providers][0]`, { provider })
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
    organizers = await clientRead.fetch(`*[ _type == "speaker" && is_organizer == true ]{
      name, title, links, "image": image.asset->url
    }`)
  } catch (error) {
    err = error as Error
  }

  return { organizers, err }
}
import { FormError } from "@/lib/proposal/types"

export enum Flags {
  localSpeaker = 'local',
  firstTimeSpeaker = 'first-time',
  diverseSpeaker = 'diverse',
  requiresTravelFunding = 'requires-funding',
}

export interface Speaker {
  _id?: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  name: string
  title?: string
  bio?: string
  email?: string
  image?: string
  links?: string[]
  imageURL?: string
  providers?: string[]
  flags?: Flags[]
  is_organizer?: boolean
}

export interface SpeakerResponse {
  speaker?: Speaker
  error?: FormError
  status: number
}

import { FormError } from "@/lib/proposal/types"

export enum Flags {
  localSpeaker = 'local',
  firstTimeSpeaker = 'first-time',
  diverseSpeaker = 'diverse',
  requiresTravelFunding = 'requires-funding',
}

export interface SpeakerRef {
  _type: string
  _ref: string
}

interface SpeakerBase {
  name: string
  title?: string
  bio?: string
  image?: string
  links?: string[]
  flags?: Flags[]
}

export interface SpeakerInput extends SpeakerBase {

}

export interface Speaker extends SpeakerBase {
  _id: string
  _rev: string
  _createdAt: string
  _updatedAt: string
  email: string
  providers?: string[]
  imageURL?: string
  is_organizer?: boolean
}

export interface SpeakerResponse {
  speaker?: Speaker
  error?: FormError
  status: number
}

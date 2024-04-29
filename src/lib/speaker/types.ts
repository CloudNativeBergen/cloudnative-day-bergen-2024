import { FormError } from "@/lib/proposal/types"

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
  is_local: boolean
  is_first_time: boolean
  is_diverse: boolean
}

export interface SpeakerResponse {
  speaker?: Speaker
  error?: FormError
  status: number
}

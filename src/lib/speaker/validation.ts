import { FormValidationError } from "@/lib/proposal/types"
import { Speaker } from "@/lib/speaker/types"

export function convertJsonToSpeaker(json: any): Speaker {
  return {
    name: json.name as string,
    title: json.title as string,
    bio: json.bio as string,
    links: json.links || [],
    is_diverse: json.is_diverse as boolean,
    is_first_time: json.is_first_time as boolean,
    is_local: json.is_local as boolean,
  }
}

export function validateSpeaker(speaker: Speaker): FormValidationError[] {
  const validationErrors = []

  if (!speaker.name) {
    validationErrors.push({ message: 'Name can not be empty', field: 'speaker_name' })
  }

  // check if speaker links contain empty links
  if (speaker.links && speaker.links.some(link => link === '')) {
    validationErrors.push({ message: 'Links cannot be empty', field: 'speaker_links' })
  }

  return validationErrors
}
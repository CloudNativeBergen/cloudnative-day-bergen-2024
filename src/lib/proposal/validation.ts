import { Format, Language, Level, Proposal, ProposalValidationError, Speaker } from "@/types/proposal"

// This function converts a JSON object to a Proposal object. This is useful when we receive a Proposal object from the API and we want to convert it to a Proposal object that we can use in our application.
// This function omits fields that should not be set by the user, such as the ID of the Proposal and the status of the Proposal.
export function convertJsonToProposal(json: any): Proposal {
  return {
    title: json.title as string,
    description: json.description as string,
    format: Format[json.format as keyof typeof Format],
    language: Language[json.language as keyof typeof Language],
    level: Level[json.level as keyof typeof Level],
    tags: json.tags || [],
    tos: json.tos as boolean,
    outline: json.outline as string,
    speaker: {
      name: json.speaker.name as string,
      title: json.speaker.title as string,
      email: json.speaker.email as string,
      is_diverse: json.speaker.is_diverse as boolean,
      is_first_time: json.speaker.is_first_time as boolean,
      is_local: json.speaker.is_local as boolean,
    } as Speaker,
  }
}

export function validateProposal(proposal: Proposal): ProposalValidationError[] {
  const validationErrors = []

  if (!proposal.title) {
    validationErrors.push({ message: 'Title can not be empty', field: 'title' })
  }

  if (!proposal.description) {
    validationErrors.push({ message: 'Abstract can not be empty', field: 'description' })
  }

  if (!proposal.format) {
    validationErrors.push({ message: 'Format must be specified', field: 'format' })
  } else if (!Object.values(Format).includes(proposal.format)) {
    validationErrors.push({ message: `Invalid format "${proposal.format}"`, field: 'format' })
  }

  if (!proposal.language) {
    validationErrors.push({ message: 'Language must be specified', field: 'language' })
  } else if (!Object.values(Language).includes(proposal.language)) {
    validationErrors.push({ message: `Invalid language "${proposal.language}"`, field: 'language' })
  }

  if (!proposal.level) {
    validationErrors.push({ message: 'Level must be specified', field: 'level' })
  } else if (!Object.values(Level).includes(proposal.level)) {
    validationErrors.push({ message: `Invalid level ${proposal.level}`, field: 'level' })
  }

  if (!proposal.tos) {
    validationErrors.push({ message: 'Terms of Service must be accepted', field: 'tos' })
  }

  // validate speaker

  return validationErrors
}

export function validateSpeaker(speaker: Speaker): ProposalValidationError[] {
  const validationErrors = []

  if (!speaker.name) {
    validationErrors.push({ message: 'Name can not be empty', field: 'speaker_name' })
  }

  if (!speaker.title) {
    validationErrors.push({ message: 'Title can not be empty', field: 'speaker_title' })
  }

  if (!speaker.email) {
    validationErrors.push({ message: 'Email can not be empty', field: 'speaker_email' })
  }

  return validationErrors
}
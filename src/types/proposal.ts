export enum Language {
  norwegian = 'norwegian',
  english = 'english',
}

export enum Level {
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

export enum Format {
  lightning_10 = 'lightning_10',
  presentation_25 = 'presentation_25',
  presentation_45 = 'presentation_45',
}

export enum Status {
  submitted = 'submitted', // submitted by the speaker
  selected = 'selected',   // selected by the organizers
  accepted = 'accepted',   // accepted by the speaker
  rejected = 'rejected',   // rejected by the organizers
}

export interface Proposal {
  _id?: string
  _createdAt?: string
  _updatedAt?: string
  title: string
  description: string
  language: Language
  format: Format
  level: Level
  outline: string
  tags?: string[]
  tos: boolean
  status?: Status
}

export interface ProposalResponse {
  proposal?: Proposal
  error?: string
  status?: number
}

export interface ProposalSubmitResponse {
  error?: ProposalSubmitError
  status?: number
}

export interface ProposalSubmitError {
  message: string
  type: string
  validationErrors?: ProposalValidationError[]
}

export interface ProposalValidationError {
  message: string
  field: string
}

export interface ProposalListResponse {
  proposals: Proposal[]
  error?: string
  status?: number
}

export const languages = new Map([
  [Language.norwegian, 'Norwegian'],
  [Language.english, 'English'],
])

export const levels = new Map([
  [Level.beginner, 'Beginner'],
  [Level.intermediate, 'Intermediate'],
  [Level.advanced, 'Advanced'],
])

export const formats = new Map([
  [Format.lightning_10, 'Lightning Talk (10 min)'],
  [Format.presentation_25, 'Presentation (25 min)'],
  [Format.presentation_45, 'Presentation (45 min)'],
])

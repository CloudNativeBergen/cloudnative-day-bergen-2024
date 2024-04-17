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
  _rev?: string
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
  speaker?: Speaker
}

export interface SpeakerRef {
  _ref: string
  _type: string
}

export interface Speaker {
  _id?: string
  name: string
  title: string
  email: string
  is_local: boolean
  is_first_time: boolean
  is_diverse: boolean
}

export interface ProposalBaseResponse {
  status: number
}

export interface ProposalError {
  message: string
  type: string
  validationErrors?: ProposalValidationError[]
}

export interface ProposalValidationError {
  message: string
  field: string
}

export interface ProposalResponse extends ProposalBaseResponse {
  proposal?: Proposal
  error?: ProposalError
}

export interface ProposalListResponse extends ProposalBaseResponse {
  proposals?: Proposal[]
  error?: ProposalError
}

export const statuses = new Map([
  [Status.submitted, 'Submitted'],
  [Status.selected, 'Selected'],
  [Status.accepted, 'Accepted'],
  [Status.rejected, 'Rejected'],
])

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

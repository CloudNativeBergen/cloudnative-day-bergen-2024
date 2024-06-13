import { Speaker } from "@/lib/speaker/types"

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
  draft = 'draft',         // draft by the speaker
  submitted = 'submitted', // submitted by the speaker
  accepted = 'accepted',   // accepted by the organizers
  confirmed = 'confirmed', // confirmed by the speaker
  rejected = 'rejected',   // rejected by the organizers
  withdrawn = 'withdrawn', // withdrawn by the speaker
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

export interface ProposalBaseResponse {
  status: number
}

export interface FormError {
  message: string
  type: string
  validationErrors?: FormValidationError[]
}

export interface FormValidationError {
  message: string
  field: string
}

export interface ProposalActionResponse extends ProposalBaseResponse {
  proposalStatus?: Status
  error?: FormError
}

export interface ProposalResponse extends ProposalBaseResponse {
  proposal?: Proposal
  error?: FormError
}

export interface ProposalListResponse extends ProposalBaseResponse {
  proposals?: Proposal[]
  error?: FormError
}

export const statuses = new Map([
  [Status.draft, 'Draft'],
  [Status.submitted, 'Submitted'],
  [Status.accepted, 'Accepted'],
  [Status.rejected, 'Rejected'],
  [Status.confirmed, 'Confirmed'],
  [Status.withdrawn, 'Withdrawn'],
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

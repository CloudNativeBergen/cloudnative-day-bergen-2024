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

export interface CFP {
  _id?: string
  title: string
  description: string
  language: Language
  format: Format
  level: Level
  outline: string
  tags?: string[]
  tos: boolean
}

export interface CfpResponse {
  cfp?: CFP
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

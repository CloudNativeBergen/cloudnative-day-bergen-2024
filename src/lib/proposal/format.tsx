import {
  Level,
  levels,
  Status,
  statuses,
  Language,
  languages,
  Format,
  formats,
} from './types'

export function FormatFormat({ format }: { format?: string }) {
  let text: string
  let color: string

  // Format.lightning_10
  // Format.presentation_25
  // Format.presentation_45

  switch (format) {
    case Format.lightning_10:
      text = formats.get(Format.lightning_10) ?? format
      color = 'bg-gray-100 text-gray-800'
      break
    case Format.presentation_25:
      text = formats.get(Format.presentation_25) ?? format
      color = 'bg-gray-100 text-gray-800'
      break
    case Format.presentation_45:
      text = formats.get(Format.presentation_45) ?? format
      color = 'bg-gray-100 text-gray-800'
      break
    default:
      text = 'Unknown'
      color = 'bg-gray-100 text-gray-800'
      break
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {text}
    </span>
  )
}

export function FormatLanguage({ language }: { language?: string }) {
  let text: string
  let color: string

  switch (language) {
    case Language.english:
      text = languages.get(Language.english) ?? language
      color = 'bg-gray-100 text-gray-800'
      break
    case Language.norwegian:
      text = languages.get(Language.norwegian) ?? language
      color = 'bg-gray-100 text-gray-800'
      break
    default:
      text = 'Unknown'
      color = 'bg-gray-100 text-gray-800'
      break
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {text}
    </span>
  )
}

export function FormatLevel({ level }: { level?: string }) {
  let text: string
  let color: string

  switch (level) {
    case Level.beginner:
      text = levels.get(Level.beginner) ?? level
      color = 'bg-green-100 text-green-800'
      break
    case Level.intermediate:
      text = levels.get(Level.intermediate) ?? level
      color = 'bg-yellow-100 text-yellow-800'
      break
    case Level.advanced:
      text = levels.get(Level.advanced) ?? level
      color = 'bg-red-100 text-red-800'
      break
    default:
      text = 'Unknown'
      color = 'bg-gray-100 text-gray-800'
      break
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {text}
    </span>
  )
}

export function FormatStatus({ status }: { status?: string }) {
  let text: string
  let color: string

  switch (status) {
    case Status.draft:
      text = statuses.get(Status.draft) ?? status
      color = 'bg-yellow-100 text-yellow-800'
      break
    case Status.submitted:
      text = statuses.get(Status.submitted) ?? status
      color = 'bg-blue-100 text-blue-800'
      break
    case Status.accepted:
      text = statuses.get(Status.accepted) ?? status
      color = 'bg-green-100 text-green-800'
      break
    case Status.rejected:
      text = statuses.get(Status.rejected) ?? status
      color = 'bg-red-100 text-red-800'
      break
    case Status.confirmed:
      text = statuses.get(Status.confirmed) ?? status
      color = 'bg-green-100 text-green-800'
      break
    case Status.withdrawn:
      text = statuses.get(Status.withdrawn) ?? status
      color = 'bg-red-100 text-red-800'
      break
    default:
      text = 'Unknown'
      color = 'bg-gray-100 text-gray-800'
      break
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {text}
    </span>
  )
}

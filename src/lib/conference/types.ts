import { Speaker } from "../speaker/types"

export interface Conference {
  title: string
  organizer: string
  city: string
  country: string
  venue_name?: string
  venue_address?: string
  tagline?: string
  description?: string
  start_date?: string
  end_date?: string
  cfp_start_date?: string
  cfp_end_date?: string
  cfp_notify_date?: string
  program_date?: string
  coc_link?: string
  registration_link?: string
  registration_enabled: boolean
  contact_email: string
  social_links?: string[]
  organizers?: Speaker[]
  domains?: string[]
  features?: string[]
}

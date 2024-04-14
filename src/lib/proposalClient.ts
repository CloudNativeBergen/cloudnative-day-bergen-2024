import {
  Proposal,
  ProposalListResponse,
  ProposalResponse,
  ProposalSubmitResponse,
  ProposalValidationError,
  Format,
  Language,
  Level,
} from '@/types/proposal';

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

  return validationErrors
}

export async function listProposals(): Promise<ProposalListResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cfp`, { cache: 'no-store' })
  return await res.json() as ProposalListResponse
}

export async function getProposal(id?: string): Promise<ProposalResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/cfp`
  if (id) {
    url += `/${id}`
  }

  const res = await fetch(url, { cache: 'no-store' })
  return await res.json() as ProposalResponse
}

export async function postProposal(proposal: Proposal, id?: string): Promise<ProposalSubmitResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/cfp`
  let method = 'POST'
  if (id) {
    url += `/${id}`
    method = 'PUT'
  }

  const res = await fetch(url, {
    cache: 'no-store',
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proposal),
  });

  return await res.json() as ProposalSubmitResponse
}
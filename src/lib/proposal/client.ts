import { Action } from '@/app/api/proposal/[id]/action/route';
import {
  Proposal,
  ProposalActionResponse,
  ProposalListResponse,
  ProposalResponse,
} from '@/lib/proposal/types';


export async function listProposals(): Promise<ProposalListResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/proposal`, { cache: 'no-store', next: { revalidate: 0 } })
  return await res.json() as ProposalListResponse
}

export async function listAllProposals(): Promise<ProposalListResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/proposal/all`, { cache: 'no-store', next: { revalidate: 0 } })
  return await res.json() as ProposalListResponse
}

export async function getProposal(id?: string): Promise<ProposalResponse> {
  let url = `${process.env.NEXT_PUBLIC_URL}/api/proposal`
  if (id) {
    url += `/${id}`
  }

  const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } })
  return await res.json() as ProposalResponse
}

export async function postProposal(proposal: Proposal, id?: string): Promise<ProposalResponse> {
  if (id === 'new') id = undefined

  let url = `${process.env.NEXT_PUBLIC_URL}/api/proposal`
  let method = 'POST'
  if (id) {
    url += `/${id}`
    method = 'PUT'
  }

  const res = await fetch(url, {
    next: { revalidate: 0 },
    cache: 'no-store',
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proposal),
  });

  return await res.json() as ProposalResponse
}

export async function postProposalAction(id: string, action: Action, notify: boolean, comment: string): Promise<ProposalActionResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/proposal/${id}/action`, {
    next: { revalidate: 0 },
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, notify, comment }),
  });

  return await res.json() as ProposalActionResponse
}
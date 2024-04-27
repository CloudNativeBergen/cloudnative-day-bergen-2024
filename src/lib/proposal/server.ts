import { Proposal, ProposalListResponse, ProposalResponse, FormValidationError } from "@/lib/proposal/types"
import { NextResponse } from "next/server"

export function proposalResponseError({ error, message, validationErrors, type = "server", status = 500 }: { error?: any, message: string, validationErrors?: FormValidationError[], type?: string, status?: number }) {
  if (error) {
    console.error(error)
  }

  const response = new NextResponse(JSON.stringify({ error: { message, type, validationErrors }, status } as ProposalResponse), { status })
  response.headers.set('cache-control', 'no-store')

  return response
}

export function proposalResponse(proposal: Proposal) {
  const response = NextResponse.json({ proposal } as ProposalResponse)
  response.headers.set('cache-control', 'no-store')
  if (proposal._rev) response.headers.set('etag', proposal._rev)
  if (proposal._updatedAt) response.headers.set('last-modified', new Date(proposal._updatedAt).toUTCString())
  return response
}

export function proposalListResponseError(error: any, message: string, type = "server", status = 500) {
  console.error(error)

  const response = new NextResponse(JSON.stringify({ error: { message, type }, status } as ProposalListResponse), { status })
  response.headers.set('cache-control', 'no-store')

  return response
}

export function proposalListResponse(proposals: Proposal[]) {
  const response = NextResponse.json({ proposals } as ProposalListResponse)
  response.headers.set('cache-control', 'no-store')
  return response
}

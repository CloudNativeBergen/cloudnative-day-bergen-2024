import { ProposalResponse } from "@/types/proposal"
import { NextResponse } from "next/server"

export function proposalSubmitResponseError(error: any, message: string, type = "server_error", status = 500) {
  console.error(error)

  const response = new NextResponse(JSON.stringify({ error: { message, type }, status } as ProposalResponse), { status })
  response.headers.set('cache-control', 'no-store')

  return response
}
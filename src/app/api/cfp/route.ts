import { NextResponse } from "next/server";
import { Proposal, ProposalResponse, ProposalSubmitResponse, Status } from "@/types/proposal";
import { clientPreview } from "@/lib/sanity/client";
import { randomUUID } from "crypto";
import { convertJsonToProposal, validateProposal } from "@/lib/proposalClient";

export async function GET() {
  // @TODO Add pagination
  // @TODO Add filtering
  // @TODO Add sorting
  // @TODO Add search
  // @TODO Add user authentication

  try {
    const proposals = await clientPreview.fetch('*[_type == "talk"]')
    const response = NextResponse.json({ proposals } as ProposalResponse)
    response.headers.set('cache-control', 'no-store')
    return response
  } catch (error) {
    console.error(error)

    let message = "An unknown error occurred"
    if (error instanceof Error) {
      message = error.message
    }

    const response = new NextResponse(JSON.stringify({ error: message, status: 500 } as ProposalResponse), { status: 500 })
    response.headers.set('cache-control', 'no-store')
    return response
  }
}

export async function POST(req: Request, res: Response) {
  // @TODO Attach user as author

  const _type = 'talk'
  const _id = randomUUID().toString()
  const status = Status.submitted
  const data = await req.json() as Proposal
  const proposal = convertJsonToProposal(data)
  const validationErrors = validateProposal(proposal)

  if (validationErrors.length > 0) {
    const response = NextResponse.json({ error: { message: "Proposal contains invalid fields", type: "validation", validationErrors }, status: 400 } as ProposalSubmitResponse, { status: 400 })
    response.headers.set('cache-control', 'no-store')
    return response
  }

  try {
    const created = await clientPreview.create({ _type, _id, status, ...proposal })
    return NextResponse.json({ proposal: created } as ProposalSubmitResponse, { status: 201 })
  } catch (error) {
    console.error(error)

    let message = "An unknown error occurred"
    if (error instanceof Error) {
      message = error.message
    }

    const response = new NextResponse(JSON.stringify({ error: { message }, status: 500 } as ProposalSubmitResponse), { status: 500 })
    response.headers.set('cache-control', 'no-store')
    return response
  }
}
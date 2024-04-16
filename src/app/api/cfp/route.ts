import { NextResponse } from "next/server";
import { Proposal, ProposalListResponse, ProposalResponse, ProposalValidationError, Status } from "@/types/proposal";
import { clientPreview } from "@/lib/sanity/client";
import { randomUUID } from "crypto";
import { convertJsonToProposal, validateProposal } from "@/lib/proposalClient";
import { NextAuthRequest, auth } from "@/lib/auth";
import { __tmp_wrap_presenceStore } from "sanity";

function proposalResponseError({ error, message, validationErrors, type = "server", status = 500 }: { error?: any, message: string, validationErrors?: ProposalValidationError[], type?: string, status?: number }) {
  if (error) {
    console.error(error)
  }

  const response = new NextResponse(JSON.stringify({ error: { message, type, validationErrors }, status } as ProposalResponse), { status })
  response.headers.set('cache-control', 'no-store')

  return response
}

function proposalResponse(proposal: Proposal) {
  const response = NextResponse.json({ proposal } as ProposalResponse)
  response.headers.set('cache-control', 'no-store')
  return response
}

function proposalListResponseError(error: any, message: string, type = "server", status = 500) {
  console.error(error)

  const response = new NextResponse(JSON.stringify({ error: { message, type }, status } as ProposalListResponse), { status })
  response.headers.set('cache-control', 'no-store')

  return response
}

function proposalListResponse(proposals: Proposal[]) {
  const response = NextResponse.json({ proposals } as ProposalListResponse)
  response.headers.set('cache-control', 'no-store')
  return response
}

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.user.email) {
    return proposalListResponseError(new Error("Unauthorized"), "Unauthorized", "authentication", 401)
  }

  try {
    const proposals = await clientPreview.fetch(`*[ _type == "talk" ]{
      ...,
      speaker-> {
        _id, email
      }
    }[ speaker.email==$email ]`, { email: req.auth.user.email })
    return proposalListResponse(proposals)
  } catch (error) {
    return proposalListResponseError(error, "Failed to fetch proposals")
  }
}) as any;

export const POST = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.user.email) {
    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const data = await req.json() as Proposal
  const proposal = convertJsonToProposal(data)

  // Validate the proposal
  const validationErrors = validateProposal(proposal)
  if (validationErrors.length > 0) {
    return proposalResponseError({ message: "Proposal contains invalid fields", validationErrors, type: "validation", status: 400 })
  }

  // Upsert speaker profile
  const speaker = { _type: 'reference', _ref: '' }
  try {
    let speakerCheck = await clientPreview.fetch(`*[ _type == "speaker" && email==$email ][0] { _id }`, { email: req.auth.user.email })
    if (!speakerCheck) {
      let { _id: speakerId } = await clientPreview.create({
        _type: 'speaker',
        email: req.auth.user.email,
        name: proposal.speaker?.name ?? req.auth.user.name ?? "",
        title: proposal.speaker?.title ?? "",
      })
      speaker._ref = speakerId
    } else {
      await clientPreview.patch(speakerCheck._id).set({
        name: proposal.speaker?.name ?? req.auth.user.name ?? "",
        title: proposal.speaker?.title ?? "",
      }).commit()
      speaker._ref = speakerCheck._id
    }
  } catch (error) {
    return proposalResponseError({ error, message: "Failed to upsert speaker profile" })
  }

  // Create the proposal
  const _type = 'talk'
  const _id = randomUUID().toString()
  const status = Status.submitted

  try {
    const created = await clientPreview.create({ _type, _id, status, speaker, ...proposal }) as Proposal
    return proposalResponse(created)
  } catch (error) {
    return proposalResponseError({ error, message: "Failed to create proposal" })
  }
}) as any;
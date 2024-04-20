import { Proposal, Speaker } from "@/types/proposal";
import { NextAuthRequest, auth } from "@/lib/auth";
import { convertJsonToProposal, validateProposal } from "@/lib/proposal/validation";
import { getProposal, updateProposal } from "@/lib/proposal/sanity";
import { proposalResponse, proposalResponseError } from "@/lib/proposal/server";
import { updateSpeaker } from "@/lib/speaker/sanity";

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest, { params }: { params: Record<string, string | string[] | undefined> }) => {
  const id = params.id as string

  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id) {
    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const { proposal, err: error } = await getProposal(id, req.auth.user.email)
  if (error) {
    return proposalResponseError({ error, message: "Error fetching proposal from database", type: "server", status: 500 })
  }

  if (proposal) {
    console.log(proposal._id, proposal.title, proposal.speaker?.name)
    return proposalResponse(proposal)
  } else {
    return proposalResponseError({ message: "Document not found", type: "not_found", status: 404 })
  }
}) as any;

export const PUT = auth(async (req: NextAuthRequest, { params }: { params: Record<string, string | string[] | undefined> }) => {
  const id = params.id as string

  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id) {
    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const data = await req.json() as Proposal
  const proposal = convertJsonToProposal(data)

  const validationErrors = validateProposal(proposal)
  if (validationErrors.length > 0) {
    return proposalResponseError({ message: "Proposal contains invalid fields", validationErrors, type: "validation", status: 400 })
  }

  const { proposal: existingProposal, err: checkErr } = await getProposal(id, req.auth.user.email)
  if (checkErr) {
    return proposalResponseError({ error: checkErr, message: "Error fetching proposal from database", type: "server", status: 500 })
  }

  if (!existingProposal) {
    return proposalResponseError({ message: "Proposal not found", type: "not_found", status: 404 })
  }

  if (!existingProposal.speaker || !("_id" in existingProposal.speaker) || !existingProposal.speaker._id) {
    const error = new Error("Invalid speaker reference")
    return proposalResponseError({ error, message: error.message, type: "server", status: 500 })
  }

  const speakerId = existingProposal.speaker._id
  const { speaker: _, err: speakerErr } = await updateSpeaker(speakerId, proposal.speaker as Speaker, req.auth.user.email)
  if (speakerErr) {
    return proposalResponseError({ error: speakerErr, message: "Error updating speaker in database", type: "server", status: 500 })
  }

  const { proposal: updatedProposal, err: updateErr } = await updateProposal(id, proposal, speakerId)
  if (updateErr) {
    return proposalResponseError({ error: updateErr, message: "Error updating proposal in database", type: "server", status: 500 })
  }

  return proposalResponse(updatedProposal)
}) as any;
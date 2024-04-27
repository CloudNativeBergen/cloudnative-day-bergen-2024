import { Proposal, Speaker } from "@/types/proposal";
import { convertJsonToProposal, validateProposal } from "@/lib/proposal/validation";
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalListResponse, proposalListResponseError, proposalResponse, proposalResponseError } from "@/lib/proposal/server";
import { createProposal, getProposals } from "@/lib/proposal/sanity";
import { updateSpeaker } from "@/lib/speaker/sanity";

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id) {
    return proposalListResponseError(new Error("Unauthorized"), "Unauthorized", "authentication", 401)
  }

  const { proposals, err } = await getProposals(req.auth.user.email)
  if (err) {
    return proposalListResponseError(err, "Failed to fetch proposals")
  }

  return proposalListResponse(proposals)
}) as any;

export const POST = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id) {
    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const data = await req.json() as Proposal
  const proposal = convertJsonToProposal(data)

  const validationErrors = validateProposal(proposal)
  if (validationErrors.length > 0) {
    return proposalResponseError({ message: "Proposal contains invalid fields", validationErrors, type: "validation", status: 400 })
  }

  // validate speaker
  const { err: speakerErr } = await updateSpeaker(req.auth.speaker._id, proposal.speaker as Speaker, req.auth.user.email)
  if (speakerErr) {
    return proposalResponseError({ error: speakerErr, message: "Failed to update speaker" })
  }

  const { proposal: created, err } = await createProposal(proposal, req.auth.speaker._id)
  if (err) {
    return proposalResponseError({ error: err, message: "Failed to create proposal" })
  }

  return proposalResponse(created)
}) as any;
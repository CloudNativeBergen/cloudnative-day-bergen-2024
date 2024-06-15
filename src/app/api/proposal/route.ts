import { ProposalInput } from "@/lib/proposal/types";
import { convertJsonToProposal, validateProposal } from "@/lib/proposal/validation";
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalListResponse, proposalListResponseError, proposalResponse, proposalResponseError } from "@/lib/proposal/server";
import { createProposal, getProposals } from "@/lib/proposal/sanity";

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return proposalListResponseError(new Error("Unauthorized"), "Unauthorized", "authentication", 401)
  }

  const { proposals, err } = await getProposals(req.auth.speaker._id)
  if (err) {
    return proposalListResponseError(err, "Failed to fetch proposals")
  }

  return proposalListResponse(proposals)
}) as any;

export const POST = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const data = await req.json() as ProposalInput
  const proposal = convertJsonToProposal(data)

  const validationErrors = validateProposal(proposal)
  if (validationErrors.length > 0) {
    return proposalResponseError({ message: "Proposal contains invalid fields", validationErrors, type: "validation", status: 400 })
  }

  const { proposal: created, err } = await createProposal(proposal, req.auth.speaker._id)
  if (err) {
    return proposalResponseError({ error: err, message: "Failed to create proposal" })
  }

  return proposalResponse(created)
}) as any;
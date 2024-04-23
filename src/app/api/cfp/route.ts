import { Proposal, Status } from "@/types/proposal";
import { clientWrite } from "@/lib/sanity/client";
import { randomUUID } from "crypto";
import { convertJsonToProposal, validateProposal } from "@/lib/proposal/validation";
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalListResponse, proposalListResponseError, proposalResponse, proposalResponseError } from "@/lib/proposal/server";

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id) {
    return proposalListResponseError(new Error("Unauthorized"), "Unauthorized", "authentication", 401)
  }

  try {
    const proposals = await clientWrite.fetch(`*[ _type == "talk" ]{
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
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id) {
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
  const speaker = { _type: 'reference', _ref: req.auth.speaker._id }
  try {
    await clientWrite.patch(speaker._ref).set({
      name: proposal.speaker?.name ?? req.auth.user.name ?? "",
      title: proposal.speaker?.title ?? "",
    }).commit()
  } catch (error) {
    return proposalResponseError({ error, message: "Failed to upsert speaker profile" })
  }

  // Set proposal metadata fields
  const _type = 'talk'
  const _id = randomUUID().toString()
  const status = Status.submitted

  // Delete the speaker field from the proposal object before creating since it needs to be a reference and not an object
  delete proposal.speaker

  try {
    const created = await clientWrite.create({ _type, _id, status, speaker, ...proposal }) as Proposal
    return proposalResponse(created)
  } catch (error) {
    return proposalResponseError({ error, message: "Failed to create proposal" })
  }
}) as any;
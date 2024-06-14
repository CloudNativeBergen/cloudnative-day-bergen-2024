import { Action, ProposalActionResponse, Status } from "@/lib/proposal/types";
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalResponseError } from "@/lib/proposal/server";
import { NextResponse } from "next/server";
import { getProposal, updateProposalStatus } from "@/lib/proposal/sanity";
import { actionStateMachine } from "@/lib/proposal/states";

export const dynamic = 'force-dynamic'

export const POST = auth(async (req: NextAuthRequest, { params }: { params: Record<string, string | string[] | undefined> }) => {
  const id = params.id as string
  const { action, notify } = await req.json() as { action: Action, notify?: boolean }

  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const { proposal, err: error } = await getProposal(id, req.auth.speaker._id, req.auth.speaker.is_organizer)
  if (error || !proposal || proposal._id !== id) {
    if (error) console.error(error)
    if (!proposal) console.error("Proposal not found")

    return proposalResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const { status, isValidAction } = actionStateMachine(proposal.status, action, req.auth.speaker.is_organizer)
  if (!isValidAction) {
    console.error(`Invalid action ${action} for status ${proposal.status}`)
    return proposalResponseError({ message: "Invalid action", type: "invalid_action", status: 400 })
  }

  const { err } = await updateProposalStatus(id, status)
  if (err) {
    console.error(err)
    return proposalResponseError({ message: err.message, type: "update_error", status: 500 })
  }

  return new NextResponse(JSON.stringify({ proposalStatus: status, status: 200 } as ProposalActionResponse), { status: 200 })
}) as any;
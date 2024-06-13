import { Proposal, ProposalActionResponse, Status } from "@/lib/proposal/types";
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalResponseError } from "@/lib/proposal/server";
import { NextResponse } from "next/server";
import { getProposal, updateProposalStatus } from "@/lib/proposal/sanity";

export const dynamic = 'force-dynamic'

export enum Action {
  submit = 'submit',
  unsubmit = 'unsubmit',
  accept = 'accept',
  confirm = 'confirm',
  reject = 'reject',
  withdraw = 'withdraw'
}

// actionStateMachine is a finite state machine that determines the next status of a proposal based on the current status and the action to be taken.
export function actionStateMachine(currentStatus: Status | undefined, action: Action, isOrganizer: boolean): { status: Status, isValidAction: boolean } {
  let status = currentStatus || Status.draft;

  switch (status) {
    case Status.draft:
      if (action === Action.submit) {
        status = Status.submitted;
      }
      break;
    case Status.submitted:
      if (action === Action.unsubmit) {
        status = Status.draft;
      } else if (isOrganizer && action === Action.accept) {
        status = Status.accepted;
      } else if (isOrganizer && action === Action.reject) {
        status = Status.rejected;
      }
      break;
    case Status.accepted:
      if (action === Action.confirm) {
        status = Status.confirmed;
      } else if (action === Action.withdraw) {
        status = Status.withdrawn;
      } else if (isOrganizer && action === Action.reject) {
        status = Status.rejected;
      }
      break;
    case Status.rejected:
      if (isOrganizer && action === Action.accept) {
        status = Status.accepted;
      }
    case Status.confirmed:
      if (action === Action.withdraw) {
        status = Status.withdrawn;
      }
      break;
  }

  return { status, isValidAction: status !== currentStatus };
}

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
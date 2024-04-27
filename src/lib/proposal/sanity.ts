import { Proposal, ProposalResponse, Speaker, Status } from "@/types/proposal";
import { clientWrite } from "@/lib/sanity/client";
import { randomUUID } from "crypto";

export async function getProposal(id: string, email: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let proposal: Proposal = {} as Proposal
  let err = null

  try {
    proposal = await clientWrite.fetch(`*[ _type == "talk" && _id==$id ]{
      ...,
      speaker->
    }[ speaker.email==$email ][0]`, { id, email })
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}

export async function getProposals(email: string): Promise<{ proposals: Proposal[]; err: Error | null; }> {
  let proposals: Proposal[] = []
  let err = null

  try {
    proposals = await clientWrite.fetch(`*[ _type == "talk" ]{
      ...,
      speaker-> {
        _id, email
      }
    }[ speaker.email==$email ]`, { email })
  } catch (error) {
    err = error as Error
  }

  return { proposals, err }
}

export async function updateProposal(proposalId: string, proposal: Proposal, speakerId: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let err = null

  // Delete the speaker field from the proposal object before updating since it needs to be a reference and not an object
  delete proposal.speaker

  try {
    proposal = await clientWrite.patch(proposalId).set({ ...proposal, ...{ speaker: { _type: "reference", _ref: speakerId } } }).commit()
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}

export async function createProposal(proposal: Proposal, speakerId: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let err = null

  // Delete the speaker field from the proposal object before creating since it needs to be a reference and not an object
  delete proposal.speaker

  const _type = 'talk'
  const _id = randomUUID().toString()
  const status = Status.submitted
  const speaker = { _type: 'reference', _ref: speakerId }

  try {
    const created = await clientWrite.create({ _type, _id, status, speaker, ...proposal }) as Proposal
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}
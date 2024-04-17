import { Proposal, ProposalResponse, Speaker } from "@/types/proposal";
import { clientPreview } from "../sanity/client";

export async function getProposal(id: string, email: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let proposal: Proposal = {} as Proposal
  let err = null

  try {
    proposal = await clientPreview.fetch(`*[ _type == "talk" && _id==$id ]{
      ...,
      speaker->
    }[ speaker.email==$email ][0]`, { id, email })
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}

export async function updateSpeaker(spekaerId: string, speaker: Speaker, email: string): Promise<{ speaker: Speaker; err: Error | null; }> {
  let err = null

  // Ensure the email is updated to match the user's email
  speaker.email = email

  try {
    speaker = await clientPreview.patch(spekaerId).set(speaker).commit()
  } catch (error) {
    err = error as Error
  }

  return { speaker, err }
}

export async function updateProposal(proposalId: string, proposal: Proposal, speakerId: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let err = null

  // Delete the speaker field from the proposal object before updating since it needs to be a reference and not an object
  delete proposal.speaker

  try {
    proposal = await clientPreview.patch(proposalId).set({ ...proposal, ...{ speaker: { _type: "reference", _ref: speakerId } } }).commit()
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}
import { Proposal, Status } from "@/lib/proposal/types";
import { clientReadUncached as clientRead, clientWrite } from "@/lib/sanity/client";
import { randomUUID } from "crypto";
import { groq } from "next-sanity";
import speaker from "../../../sanity/schemaTypes/speaker";

export async function getProposal(id: string, speakerId: string, isOrganizer = false): Promise<{ proposal: Proposal; err: Error | null; }> {
  let proposal: Proposal = {} as Proposal
  let err = null

  const speakerFilter = isOrganizer ? "" : "[ speaker._id == $speakerId ]"

  try {
    proposal = await clientRead.fetch(groq`*[ _type == "talk" && _id==$id ]{
      ...,
      speaker-> {
        ...,
        "image": image.asset->url
      }
    }${speakerFilter}[0]`, { id, speakerId }, { cache: "no-store" })
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}

export async function getProposals(speakerId: string, returnAll: boolean = false): Promise<{ proposals: Proposal[]; err: Error | null; }> {
  let proposals: Proposal[] = []
  let err = null

  const speakerFilter = returnAll ? `[ defined(status) && status != "${Status.draft}" ]` : "[ speaker._id == $speakerId ]"

  try {
    proposals = await clientRead.fetch(groq`*[ _type == "talk" ]{
      ...,
      speaker-> {
        _id, name, email, providers, "image": image.asset->url
      }
    }${speakerFilter} | order(_createdAt desc)`, { speakerId }, { cache: "no-store" })
  } catch (error) {
    err = error as Error
  }

  return { proposals, err }
}

export async function updateProposal(proposalId: string, proposal: Proposal, speakerId: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let err = null

  // Delete the speaker field from the proposal object before updating since it needs to be a reference and not an object
  delete proposal.speaker
  delete proposal.status

  try {
    proposal = await clientWrite.patch(proposalId).set({ ...proposal, ...{ speaker: { _type: "reference", _ref: speakerId } } }).commit()
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}

export async function updateProposalStatus(proposalId: string, status: Status): Promise<{ proposal: Proposal; err: Error | null; }> {
  let err = null
  let proposal: Proposal = {} as Proposal

  try {
    proposal = await clientWrite.patch(proposalId).set({ status }).commit()
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}

export async function createProposal(proposal: Proposal, speakerId: string): Promise<{ proposal: Proposal; err: Error | null; }> {
  let err = null

  // Delete the speaker field from the proposal object before creating since it needs to be a reference and not an object
  delete proposal._id
  delete proposal.speaker

  const _type = 'talk'
  const _id = randomUUID().toString()
  const status = Status.submitted
  const speaker = { _type: 'reference', _ref: speakerId }

  try {
    proposal = await clientWrite.create({ _type, _id, status, speaker, ...proposal }) as Proposal
  } catch (error) {
    err = error as Error
  }

  return { proposal, err }
}
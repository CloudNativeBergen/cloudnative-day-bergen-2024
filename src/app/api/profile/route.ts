import { getToken } from "next-auth/jwt";
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalResponseError } from "@/lib/proposal/server";
import { getSpeaker, updateSpeaker } from "@/lib/speaker/sanity";
import { speakerResponse, speakerResponseError } from "@/lib/speaker/server";
import { convertJsonToSpeaker, validateSpeaker } from "@/lib/speaker/validation";
import { Proposal } from "@/lib/proposal/types";

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return speakerResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  console.log(req.auth)
  const { speaker, err } = await getSpeaker(req.auth.account)
  if (err || !speaker) {
    return speakerResponseError({ error: err, message: "Failed to fetch speaker" })
  }

  return speakerResponse(speaker)
}) as any;

export const PUT = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return speakerResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const data = await req.json() as Proposal
  const speaker = convertJsonToSpeaker(data)

  // @TODO Validate speaker email change against existing speakers
  const validationErrors = validateSpeaker(speaker)
  if (validationErrors.length > 0) {
    return proposalResponseError({ message: "Speaker contains invalid fields", validationErrors, type: "validation", status: 400 })
  }

  const { speaker: updatedSpeaker, err: updateErr } = await updateSpeaker(req.auth.speaker._id, speaker)
  if (updateErr) {
    return proposalResponseError({ error: updateErr, message: "Error updating proposal in database", type: "server", status: 500 })
  }

  return speakerResponse(updatedSpeaker)

}) as any;
import { NextAuthRequest, auth } from "@/lib/auth";
import { proposalListResponse, proposalListResponseError, proposalResponse, proposalResponseError } from "@/lib/proposal/server";
import { getProposals } from "@/lib/proposal/sanity";

export const dynamic = 'force-dynamic'

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account || !req.auth.speaker.is_organizer) {
    return proposalListResponseError(new Error("Unauthorized"), "Unauthorized", "authentication", 401)
  }

  const { proposals, err } = await getProposals(req.auth.speaker._id, req.auth.speaker.is_organizer)
  if (err) {
    return proposalListResponseError(err, "Failed to fetch proposals")
  }

  return proposalListResponse(proposals)
}) as any;
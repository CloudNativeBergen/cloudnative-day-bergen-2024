import { NextAuthRequest, auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ProfileEmailResponse } from "@/lib/profile/types";
import { verifiedEmails } from "@/lib/profile/github";
import { defaultEmails, profileEmailResponseError } from "@/lib/profile/server";

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return profileEmailResponseError({ emails: [], message: "Unauthorized", type: "authentication", status: 401 })
  }

  let emails = defaultEmails(req.auth)

  switch (req.auth.account?.provider) {
    case 'github':
      let { error, emails } = await verifiedEmails(req.auth.account)

      if (emails.length === 0) {
        emails = defaultEmails(req.auth)
      }

      if (error) {
        console.error(error)
        return profileEmailResponseError({ emails, message: "Failed to fetch emails", error, status: 200 })
      }

      return NextResponse.json({ emails } as ProfileEmailResponse)

    default:
      console.error(`Emails not implemented for provider: ${req.auth.account?.provider}`)
      return NextResponse.json({ emails: defaultEmails(req.auth) } as ProfileEmailResponse)
  }
}) as any;

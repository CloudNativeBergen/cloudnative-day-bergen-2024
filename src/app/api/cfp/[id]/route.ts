import { NextRequest, NextResponse } from "next/server";
import { ProposalResponse, Proposal } from "@/types/proposal";
import { clientPreview } from "@/lib/sanity/client";
import { NextAuthRequest, auth } from "@/lib/auth";

export const GET = auth(async (req: NextAuthRequest, { params }: { params: Record<string, string | string[] | undefined> }): Promise<NextResponse> => {
  const id = params.id as string

  if (!req.auth || !req.auth.user || !req.auth.user.email) {
    return NextResponse.json({ error: { message: "Unauthorized", type: "authentication" }, status: 401 }, { status: 401 })
  }

  try {
    const proposal = await clientPreview.fetch(`*[ _type == "talk" && _id==$id ]{
      ...,
      speaker->
    }[ speaker.email==$email ][0]`, { id, email: req.auth.user.email })
    if (proposal) {
      return NextResponse.json({ proposal, status: 200 } as ProposalResponse)
    } else {
      return NextResponse.json({ error: { message: "Document not found", type: "not_found" }, status: 404 } as ProposalResponse, { status: 404 })
    }
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ error: { message: "An unknown error occurred", type: "server" }, status: 500 } as ProposalResponse), { status: 500 })
  }
}) as any;

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const proposal = await request.json() as Proposal

  // @TODO Validate request body
  // @TODO Attach user as author
  // @TODO Check user permissions

  try {
    const patched = await clientPreview.patch(params.id).set(proposal).commit()
    const response = NextResponse.json({ proposal: patched } as unknown as ProposalResponse)
    response.headers.set('cache-control', 'no-store')
    return response
  } catch (error) {
    console.error(error)

    let message = "An unknown error occurred"
    if (error instanceof Error) {
      message = error.message
    }

    const response = NextResponse.json({ error: { message, type: "server" }, status: 500 } as ProposalResponse, { status: 500 })
    response.headers.set('cache-control', 'no-store')
    return response
  }
}
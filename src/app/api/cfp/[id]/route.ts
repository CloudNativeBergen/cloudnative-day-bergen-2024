import { NextResponse } from "next/server";
import { ProposalResponse, Proposal } from "@/types/proposal";
import { clientPreview } from "@/lib/sanity/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const proposal = await clientPreview.fetch('*[_type == "talk" && _id == $id][0]', { id: params.id })
    if (proposal) {
      // @TODO check user permissions
      return NextResponse.json({ proposal, status: 200 } as ProposalResponse)
    } else {
      return new Response(JSON.stringify({ error: "Document not found", status: 404 } as ProposalResponse), { status: 404 })
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "An unknown error occurred", status: 500 } as ProposalResponse), { status: 500 })
  }
}

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

    const response = NextResponse.json({ error: message, status: 500 } as ProposalResponse, { status: 500 })
    response.headers.set('cache-control', 'no-store')
    return response
  }
}
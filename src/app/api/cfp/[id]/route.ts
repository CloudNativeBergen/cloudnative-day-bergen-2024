import { NextResponse } from "next/server";
import { CFP as CFPType, Language, Format, Level, CfpResponse } from "@/types/cfp";
import { clientPreview } from "@/lib/sanity/client";
import { randomUUID } from "crypto";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cfp = await clientPreview.fetch('*[_type == "talk" && _id == $id][0]', { id: params.id })
    if (cfp) {
      // @TODO check user permissions
      return NextResponse.json({ cfp, status: 200 } as CfpResponse)
    } else {
      return new Response(JSON.stringify({ error: "Document not found", status: 404 } as CfpResponse), { status: 404 })
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "An unknown error occurred", status: 500 } as CfpResponse), { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cfp = await request.json() as CFPType

  // @TODO Validate request body
  // @TODO Attach user as author
  // @TODO Check user permissions

  try {
    const updated = await clientPreview.createOrReplace({ _type: 'talk', _id: params.id, ...cfp })
    return NextResponse.json({ cfp: updated } as CfpResponse)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message, status: 500 } as CfpResponse), { status: 500 })
    } else {
      return new Response(JSON.stringify({ error: "An unknown error occurred", status: 500 } as CfpResponse), { status: 500 })
    }
  }
}
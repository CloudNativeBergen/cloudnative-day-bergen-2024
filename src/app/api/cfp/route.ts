import { NextResponse } from "next/server";
import { CFP as CFPType, Language, Format, Level, CfpResponse } from "@/types/cfp";
import { clientPreview } from "@/lib/sanity/client";
import { randomUUID } from "crypto";

export async function GET() {
  const cfp: CFPType = {
    title: 'Foobar',
    language: Language.english,
    format: Format.presentation_25,
    level: Level.advanced,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    outline: 'a) Lorem ipsum dolor sit amet, consectetur adipiscing elit\nb) Lorem ipsum dolor sit amet, consectetur adipiscing elit\nc) Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    tos: true,
  }

  return NextResponse.json({ cfp, status: 200 } as CfpResponse)
}

export async function POST(req: Request, res: Response) {
  // @TODO Validate request body
  // @TODO Attach user as author
  const cfp = await req.json() as CFPType
  const id = randomUUID().toString()

  try {
    const created = await clientPreview.create({ _type: 'talk', _id: id, ...cfp })
    return NextResponse.json({ cfp: created } as CfpResponse)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message, status: 500 } as CfpResponse), { status: 500 })
    } else {
      return new Response(JSON.stringify({ error: "An unknown error occurred", status: 500 } as CfpResponse), { status: 500 })
    }
  }
}
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/auth/signin`)
  }
})

export const config = {
  matcher: [
    "/cfp/:path*",
  ]
}
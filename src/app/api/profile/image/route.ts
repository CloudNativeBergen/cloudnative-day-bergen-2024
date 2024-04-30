import { NextAuthRequest, auth } from "@/lib/auth";
import { ProfileImage } from "@/lib/profile/types";
import { profileImageResponse, profileImageResponseError } from "@/lib/profile/server";
import { clientWrite } from "@/lib/sanity/client";
import { uploadProfileImage } from "@/lib/profile/sanity";

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return profileImageResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const picture: ProfileImage = { image: req.auth.user.picture || "" }

  return profileImageResponse(picture)
}) as any;

export const POST = auth(async (req: NextAuthRequest) => {
  if (!req.auth || !req.auth.user || !req.auth.speaker || !req.auth.speaker._id || !req.auth.account) {
    return profileImageResponseError({ message: "Unauthorized", type: "authentication", status: 401 })
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (files.length === 0) {
    return profileImageResponseError({ message: "No files was uploaded to the server." })
  }

  if (!files[0].type.startsWith('image/')) {
    return profileImageResponseError({ message: `Invalid file type "${files[0].type}". Please upload an image.` })
  }

  if (files[0].size > 1024 * 1024 * 10) {
    return profileImageResponseError({ message: `File size is too large. Maximum file size is 10MB.` })
  }

  const { image, error } = await uploadProfileImage(files[0], req.auth.speaker._id)
  if (error) {
    return profileImageResponseError({ message: error.message })
  }

  return profileImageResponse(image)
}) as any;

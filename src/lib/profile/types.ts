import { FormError } from "@/lib/proposal/types";

export interface ProfileEmailResponse {
  emails: ProfileEmail[];
  error?: FormError;
  status: number;
}

export interface ProfileEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export interface ProfileImage {
  image: string;
}

export interface ProfileImageResponse {
  image?: ProfileImage;
  error?: FormError;
  status: number;
}
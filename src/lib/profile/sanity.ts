import { clientWrite } from '../sanity/client'
import { ProfileImage } from './types'

export async function updateProfileEmail(
  email: string,
  speakerId: string,
): Promise<{ error: Error | null }> {
  try {
    const patch = await clientWrite.patch(speakerId).set({ email }).commit()

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

export async function uploadProfileImage(
  image: File,
  speakerId: string,
): Promise<{ image: ProfileImage; error: Error | null }> {
  try {
    const asset = await clientWrite.assets.upload('image', image, {
      filename: image.name,
    })
    const patch = await clientWrite
      .patch(speakerId)
      .set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit()

    return { image: { image: asset.url }, error: null }
  } catch (error) {
    return { image: { image: '' }, error: error as Error }
  }
}

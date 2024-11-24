import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import Image from 'next/image'
import { getPublicSpeakers } from '@/lib/speaker/sanity'

export const revalidate = 3600

export default async function Speakers() {
  const { speakers, err } = await getPublicSpeakers(revalidate)
  if (err) {
    console.error(err)
  }

  return (
    <>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Meet our speakers
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                These industry experts will share their insights and experiences
                in the world of cloud native technologies. Get ready to be
                inspired and learn from the best in the field.
              </p>
            </div>
            <ul
              role="list"
              className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6"
            >
              {speakers.map((speaker) => (
                <li key={speaker._id}>
                  <a href={`/speaker/${speaker.slug}`} className="block">
                    <Image
                      alt=""
                      src={`${speaker.image || 'https://via.placeholder.com/300'}?h=300&w=300&auto=format&fit=crop`}
                      width={300}
                      height={300}
                      className="h-30 w-30 mx-auto rounded-full"
                    />
                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                      {speaker.name}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {speaker.title}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </>
  )
}

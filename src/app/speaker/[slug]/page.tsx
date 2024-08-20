
import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { formats, languages, levels } from '@/lib/proposal/types';
import { flags, Flags } from '@/lib/speaker/types';
import getConfig from 'next/config';
import Image from 'next/image'
import * as social from '@/components/SocialIcons';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { getPublicSpeaker } from '@/lib/speaker/sanity';
import { Button } from '@/components/Button';

const { publicRuntimeConfig } = getConfig();
const { cocLink, dates } = publicRuntimeConfig;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props) {
  const { speaker, talks, err } = await getPublicSpeaker(params.slug);

  if (err || !speaker || !talks || talks.length === 0) {
    return {
      title: 'Speaker not found',
      description: 'Sorry, we couldn’t find the speaker you’re looking for.',
      image: 'https://via.placeholder.com/1200',
    }
  }

  return {
    title: `${speaker.name} - ${talks[0].title}`,
    description: talks[0].description,
    image: speaker.image || 'https://via.placeholder.com/1200',
  }
}

export default async function Profile({ params }: Props) {
  const { speaker, talks, err } = await getPublicSpeaker(params.slug);

  if (err || !speaker || !talks || talks.length === 0) {
    return (
      <Layout showFooter={false}>
        <div className="relative flex h-full items-center py-20 sm:py-36">
          <BackgroundImage className="-top-36 bottom-0" />
          <Container className="relative flex w-full flex-col items-center">
            <p className="font-display text-2xl tracking-tight text-blue-900">
              404
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
              Speaker not found
            </h1>
            <p className="mt-4 text-lg tracking-tight text-blue-900">
              Sorry, we couldn’t find the speaker you’re looking for.
            </p>
            <Button href="/" className="mt-8">
              Go back home
            </Button>
          </Container>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
            <div className="flex-1 xl:flex px-4 py-6 sm:px-6 lg:pl-8 xl:pl-6">
              {/* proposal details */}
              {talks.map((talk) => (
                <div key={talk._id} className="block">
                  <h2 className="text-3xl font-bold text-blue-900">
                    {talk.title} - {formats.get(talk.format)}
                  </h2>
                  {talk.tags && talk.tags.map((tag) => (
                    <span key={tag} className="inline-block mt-2 mr-2 px-3 py-1 text-sm font-semibold text-blue-100 bg-blue-900 rounded-full">{tag}</span>
                  ))}
                  {talk.description.split('\n\n').map((paragraph, index) => (
                    <p key={`desc-${index}`} className="mt-4 text-xl text-blue-900">{paragraph}</p>
                  ))}
                  <p className="mt-4 text-lg">Language: {languages.get(talk.language)}</p>
                  <p className="mt-2 text-lg">Level: {levels.get(talk.level)}</p>
                </div>
              ))}
            </div>

            <div className="shrink-0 px-4 py-6 sm:px-6 lg:w-96 lg:pr-8 xl:pr-6">
              {/* speaker details */}
              <div className="flex flex-col items-center">
                <div className="w-150 h-150 rounded-full overflow-hidden">
                  <Image
                    src={speaker.image || 'https://via.placeholder.com/150'}
                    alt={speaker.name}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </div>
                <h2 className="mt-4 text-2xl font-bold">{speaker.name}</h2>
                <p className="mt-2 text-gray-500">{speaker.title}</p>
                <div className="mt-2">
                  {speaker.flags && speaker.flags.includes(Flags.localSpeaker) && (
                    <span className="inline-block mt-2 mr-2 px-3 py-1 text-sm font-semibold text-blue-100 bg-blue-900 rounded-full">{flags.get(Flags.localSpeaker)}</span>
                  )}
                </div>
                {speaker.bio && speaker.bio.split('\n\n').map((paragraph, index) => (
                  <p key={`bio-${index}`} className="mt-4 text-lg">{paragraph}</p>
                ))}
                <div className="mt-4 flex space-x-2">
                  {speaker.links && speaker.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      {social.iconForLink(link)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div >
    </Layout >
  )
}

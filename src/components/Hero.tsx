import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '@/components/SocialIcons'

export function Hero() {
  return (
    <div className="relative py-20 sm:pb-24 sm:pt-36">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
            <span className="sr-only">CloudNative Day Bergen - </span>A day with Cloud & Kubernetes in Bergen.
          </h1>
          <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
            <p>
              CloudNative Day Bergen is the nerdiest tech conference in Bergen. Join us to learn about the latest trends, best practices, and experience reports from local and international cloud-native experts.
            </p>
            <p>
              Our speakers will share their insights and experiences, covering topics such as containerization, orchestration, microservices, and more. Whether you&apos;re a beginner or an 10x&apos;er, there&apos;s something for everyone at CloudNative Day Bergen.
            </p>
          </div>
          <Button href="#" className="mt-10 w-full sm:hidden">
            Get your tickets
          </Button>
          <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-16 sm:gap-y-10 sm:text-center lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:justify-start lg:text-left">
            {[
              ['Tracks', '3'],
              ['Speakers', '~20'],
              ['Attendees', '150+'],
              ['Location', 'Bergen, Norway'],
            ].map(([name, value]) => (
              <div key={name}>
                <dt className="font-mono text-sm text-blue-600">{name}</dt>
                <dd className="mt-0.5 text-2xl font-semibold tracking-tight text-blue-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex justify-center mt-10 space-x-4 sm:hidden">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <InstagramIcon className="w-12 h-12" />
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <TwitterIcon className="w-12 h-12" />
            </a>
            <a href="https://github.com/CloudNativeBergen" className="text-blue-600 hover:text-blue-800">
              <GitHubIcon className="w-12 h-12" />
            </a>
            <a href="https://www.linkedin.com/company/cloud-native-bergen" className="text-blue-600 hover:text-blue-800">
              <LinkedInIcon className="w-12 h-12" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}

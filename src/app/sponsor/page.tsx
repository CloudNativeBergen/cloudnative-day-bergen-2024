import { CheckIcon } from '@heroicons/react/20/solid'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { cocLink, dates } = publicRuntimeConfig;

// sponsor packages
const packages = [
  {
    name: 'Pod',
    id: 'sponsor-pod',
    href: '#',
    price: '5.000 NOK',
    description: "It is the basic unit of Kubernetes, and the 'Pod' sponsorship level gives you the basic benefits that just works.",
    features: [
      '2 tickets',
      'Logo on website',
      'Logo on event materials',
    ],
    mostPopular: false,
  },
  {
    name: 'Service',
    id: 'sponsor-service',
    href: '#',
    price: '15.000 NOK',
    description: "It enables traffic to your application, and the 'Service' sponsorship level offers more benefits and reach a larger audience.",
    features: [
      'Roll-up banner at event',
      'Social media mentions',
      '3 tickets',
      'Logo on website and materials',
      'Logo on conference badges',
    ],
    mostPopular: true,
  },
  {
    name: 'Ingress',
    id: 'sponsor-ingress',
    href: '#',
    price: '30.000 NOK',
    description: "It is the entry point for your application, and the 'Ingress' sponsorship level is for sponsors who want to make a big impact.",
    features: [
      'Pitch slot in program',
      'Roll-up banner at event',
      'Social media mentions',
      '5 tickets',
      'Logo on all the things',
    ],
    mostPopular: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-xl lg:max-w-4xl lg:px-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
              Become a Sponsor
            </h1>
            <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
              <p>
                Sponsor of CloudNative Day Bergen will get your name in front of the local cloud-native community. We offer a range of sponsorship packages to suit your needs and budget.
              </p>
              <p>
                Sponsors make it possible for us to host the conference and keep ticket prices low. We could not have done it without the support of our sponsors.
              </p>
            </div>
          </div>
        </Container>

        <Container>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {packages.map((spkg, spkgIdx) => (
              <div
                key={spkg.id}
                className={classNames(
                  spkg.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                  spkgIdx === 0 ? 'lg:rounded-r-none' : '',
                  spkgIdx === packages.length - 1 ? 'lg:rounded-l-none' : '',
                  'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={spkg.id}
                      className={classNames(
                        spkg.mostPopular ? 'text-blue-600' : 'text-gray-900',
                        'text-xl font-semibold leading-8'
                      )}
                    >
                      {spkg.name}
                    </h3>
                    {spkg.mostPopular ? (
                      <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-sm font-semibold leading-5 text-blue-600">
                        Most popular
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-4 text-md leading-6 text-gray-600">{spkg.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">{spkg.price}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-600"></span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-md leading-6 text-gray-600">
                    {spkg.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  href={spkg.href}
                  aria-describedby={spkg.id}
                  className={classNames(
                    spkg.mostPopular
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
                      : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300',
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  )}
                >
                  Become a &apos;{spkg.name}&apos; sponsor
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Layout>
  )
}

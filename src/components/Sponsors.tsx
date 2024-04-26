import Image from 'next/image'

import { Container } from '@/components/Container'
import logoFortytwo from '@/images/logos/fortytwo.svg'

const sponsors = [
  { name: 'Fortytwo', logo: logoFortytwo, href: 'https://fortytwo.io' },
  { name: 'TBD', logo: '' },
  { name: 'TBD', logo: '' },
  { name: 'TBD', logo: '' },
  { name: 'TBD', logo: '' },
  { name: 'TBD', logo: '' },
]

export function Sponsors() {
  return (
    <section id="sponsors" aria-label="Sponsors" className="py-20 sm:py-32">
      <Container>
        <h2 className="mx-auto max-w-2xl text-center font-display text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
          Current sponsorships for our workshops and speakers.
        </h2>
        <div className="mx-auto mt-20 grid max-w-max grid-cols-1 place-content-center gap-x-32 gap-y-12 sm:grid-cols-3 md:gap-x-16 lg:gap-x-32">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex items-center justify-center"
            >
              {sponsor.name === "TBD" && (
                <a
                  type="button"
                  href="/sponsor"
                  className="relative block w-full rounded-lg sm:gap-y-16 border-2 border-dashed border-gray-300 p-10 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <p className="mt-1 font-mono text-sm text-slate-500">
                    Become a sponsor
                  </p>
                </a>
              )}
              {sponsor.name !== "TBD" && (
                <a href={sponsor.href} className='hover:opacity-80'>
                  <Image src={sponsor.logo} alt={sponsor.name} unoptimized />
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

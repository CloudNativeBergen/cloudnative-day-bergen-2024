import Image from 'next/image'

import { Container } from '@/components/Container'
import logoAws from '@/images/logos/aws.svg'
import logoTv2 from '@/images/logos/tv2.svg'
import logoDnb from '@/images/logos/dnb.svg'
import logoFortytwo from '@/images/logos/fortytwo.svg'
import logoRedpill from '@/images/logos/redpill.svg'
import logoBekk from '@/images/logos/bekk.svg'
import logoJavabin from '@/images/logos/javabin.svg'
import logoKnowit from '@/images/logos/knowit.svg'
import logoSopra from '@/images/logos/sopra.svg'
import logoEviny from '@/images/logos/eviny.svg'
import logoTietoevry from '@/images/logos/tietoevry.svg'
import logoStacc from '@/images/logos/stacc.svg'
import logoScaleaq from '@/images/logos/scaleaq.svg'

const sponsors = [
  { name: 'AWS', logo: logoAws, href: 'https://aws.amazon.com' },
  { name: 'TV 2', logo: logoTv2, href: 'https://tv2.no' },
  { name: 'DNB', logo: logoDnb, href: 'https://dnb.no' },
  { name: 'Fortytwo', logo: logoFortytwo, href: 'https://fortytwo.io' },
  { name: 'Bekk', logo: logoBekk, href: 'https://bekk.no' },
  { name: 'Knowit', logo: logoKnowit, href: 'https://knowit.no' },
  { name: 'SopraSteria', logo: logoSopra, href: 'https://soprasteria.no' },
  { name: 'Eviny', logo: logoEviny, href: 'https://eviny.no' },
  { name: 'Tietovery', logo: logoTietoevry, href: 'https://tietoevry.com' },
  { name: 'Stacc', logo: logoStacc, href: 'https://stacc.no' },
  { name: 'javaBin', logo: logoJavabin, href: 'https://java.no' },
  { name: 'Redpill Linpro', logo: logoRedpill, href: 'https://www.redpill-linpro.com' },
  { name: 'ScaleAQ', logo: logoScaleaq, href: 'https://scaleaq.no' },
]

export function Sponsors() {
  return (
    <section id="sponsors" aria-label="Sponsors" className="py-20 sm:py-32">
      <Container>
        <h2 className="mx-auto max-w-2xl text-center font-display text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
          Our awesome sponsors that makes this event happening!
        </h2>
        <div className="mx-auto mt-20 grid max-w-max grid-cols-1 place-content-center gap-x-32 gap-y-12 sm:grid-cols-4 md:gap-x-16 lg:gap-x-32">
          {sponsors.map((sponsor, i) => (
            <div
              key={`${sponsor.name}-${i}`}
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
                  <Image src={sponsor.logo} alt={sponsor.name} className='h-20' unoptimized />
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

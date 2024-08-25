'use client'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { DiamondIcon } from '@/components/DiamondIcon'
import { Logo } from '@/components/Logo'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'
import { useSession } from 'next-auth/react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import config from '@/../next.config'

const { publicRuntimeConfig: c } = config

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="relative z-50 flex-none lg:pt-11">
      <Container className="flex flex-wrap items-center justify-center sm:justify-between lg:flex-nowrap">
        <div className="mt-10 lg:mt-0 lg:grow lg:basis-0">
          <a href="/">
            <Logo className="h-12 w-auto text-slate-900" />
          </a>
        </div>
        <div className="order-first -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap border-b border-blue-600/10 py-4 font-mono text-sm text-blue-600 sm:-mx-6 lg:order-none lg:mx-0 lg:basis-auto lg:border-0 lg:py-0">
          <div className="mx-auto flex items-center gap-4 px-4">
            <p>
              <time dateTime="2024-10-30">30. October 2024</time>
            </p>
            <DiamondIcon className="h-1.5 w-1.5 overflow-visible fill-current stroke-current" />
            <p>Bergen, Norway</p>
          </div>
        </div>
        <div className="hidden whitespace-nowrap sm:mt-10 sm:flex lg:mt-0 lg:grow lg:basis-0 lg:justify-end">
          <Button href={c?.registrationLink ?? '#'}>Get your ticket</Button>
        </div>
        <div className="ml-10 mt-10 sm:flex lg:ml-4 lg:mt-0">
          <a href="/cfp/list">
            {session ? (
              <img
                src={session.user.picture}
                alt={session.user.name}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-slate-900" />
            )}
          </a>
        </div>
      </Container>
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Track as TrackType } from '@/lib/schedule'

function ScheduleTabbed({ tracks }: { tracks: TrackType[] }) {
  let [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    let smMediaQuery = window.matchMedia('(min-width: 640px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(smMediaQuery)
    smMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      smMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <Tab.Group
      as="div"
      className="mx-auto grid max-w-2xl grid-cols-1 gap-y-6 sm:grid-cols-2 lg:hidden"
      vertical={tabOrientation === 'vertical'}
    >
      <Tab.List className="-mx-4 flex gap-x-4 gap-y-10 overflow-x-auto pb-4 pl-4 sm:mx-0 sm:flex-col sm:pb-0 sm:pl-0 sm:pr-8">
        {({ selectedIndex }) => (
          <>
            {tracks.map((track, trackIndex) => (
              <div
                key={track.number}
                className={clsx(
                  'relative w-3/4 flex-none pr-4 sm:w-auto sm:pr-0',
                  trackIndex !== selectedIndex && 'opacity-70',
                )}
              >
                <TrackSummary
                  track={{
                    ...track,
                    name: (
                      <Tab className="ui-not-focus-visible:outline-none">
                        <span className="absolute inset-0" />
                        {track.name}
                      </Tab>
                    ),
                  }}
                />
              </div>
            ))}
          </>
        )}
      </Tab.List>
      <Tab.Panels>
        {tracks.map((track) => (
          <Tab.Panel
            key={track.number}
            className="ui-not-focus-visible:outline-none"
          >
            <TimeSlots track={track} />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

function TrackSummary({ track }: { track: TrackType }) {
  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-blue-900">
        <time dateTime={track.date}>{track.name}</time>
      </h3>
      <p className="mt-1.5 text-base tracking-tight text-blue-900">
        {track.title}: {track.description}
      </p>
    </>
  )
}

function TimeSlots({ track, className }: { track: TrackType; className?: string }) {
  return (
    <ol
      role="list"
      className={clsx(
        className,
        'space-y-8 bg-white/60 px-10 py-14 text-center shadow-xl shadow-blue-900/5 backdrop-blur',
      )}
    >
      {track.talks.map((talk, talkIndex) => (
        <li
          key={`${track.number}-${talk.start}`}
          aria-label={`${talk.title} talking about ${talk.description} at ${talk.start} - ${talk.end}`}
        >
          {talkIndex > 0 && (
            <div className="mx-auto mb-8 h-px w-48 bg-indigo-500/10" />
          )}
          <h4 className="text-lg font-semibold tracking-tight text-blue-900">
            {talk.speaker?.name || talk.title}
          </h4>
          {talk.title && talk.speaker && (
            <p className="mt-1 tracking-tight text-blue-900">
              {talk.title}
            </p>
          )}
          <p className="mt-1 font-mono text-sm text-slate-500">
            <time dateTime={`${track.date}T${talk.start}-08:00`}>
              {talk.start}
            </time>{' '}
            -{' '}
            <time dateTime={`${track.date}T${talk.end}-08:00`}>
              {talk.end}
            </time>{' '}
          </p>
        </li>
      ))}
    </ol>
  )
}

function ScheduleStatic({ tracks }: { tracks: TrackType[] }) {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-x-8">
      {tracks.map((track) => (
        <section key={track.number}>
          <TrackSummary track={track} />
          <TimeSlots track={track} className="mt-10" />
        </section>
      ))}
    </div>
  )
}

export function Schedule({ tracks }: { tracks: TrackType[] }) {
  return (
    <section id="schedule" aria-label="Schedule" className="py-20 sm:py-32">
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
            Our three day schedule is jam-packed with brilliant, creative, evil
            geniuses.
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight text-blue-900">
            The worst people in our industry giving the best talks you’ve ever
            seen. Nothing will be recorded and every attendee has to sign an NDA
            to watch the talks.
          </p>
        </div>
      </Container>
      <div className="relative mt-14 sm:mt-24">
        <BackgroundImage position="right" className="-bottom-32 -top-40" />
        <Container className="relative">
          <ScheduleTabbed tracks={tracks} />
          <ScheduleStatic tracks={tracks} />
        </Container>
      </div>
    </section>
  )
}

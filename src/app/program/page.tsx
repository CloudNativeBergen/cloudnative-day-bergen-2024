import { Layout } from '@/components/Layout'
import getConfig from 'next/config'
import { clientReadUncached as clientRead } from '@/lib/sanity/client'
import { Schedule as ScheduleType } from '@/lib/schedule'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'

const { publicRuntimeConfig } = getConfig()
const { cocLink, dates, contact } = publicRuntimeConfig

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const revalidate = 3600

async function getData() {
  return await clientRead.fetch<ScheduleType[]>(
    `*[_type == "schedule"]{date, time_start, time_end, track->{number, title, description}, talk->{title, speaker->{name, "slug": slug.current, title, "image": image.asset->url}}} | order(track.number asc, time_start asc)`,
    {},
    {
      next: {
        revalidate: revalidate,
      },
    },
  )
}

type Track = {
  number: number
  title: string
  description: string
  talks: ScheduleType[]
}

type Slot = {
  title?: string
  start_time?: string
  end_time?: string
  tracks: Track[]
}

function timeDiff(start: string, end: string) {
  const [startHours, startMinutes] = start.split(':').map(Number)
  const [endHours, endMinutes] = end.split(':').map(Number)

  const startTime = new Date()
  startTime.setHours(startHours, startMinutes, 0, 0)

  const endTime = new Date()
  endTime.setHours(endHours, endMinutes, 0, 0)

  const timeDifference = endTime.getTime() - startTime.getTime()
  return timeDifference
}

function scheduleToSlots(items: ScheduleType[]) {
  let slots: Slot[] = []

  let previousItem
  let currentSlotIndex = 0

  for (const item of items) {
    if (!item.talk) {
      continue
    }

    item.track.number--

    if (previousItem) {
      if (item.track.number !== previousItem.track.number) {
        currentSlotIndex = 0
      } else if (!item.talk?.speaker || !previousItem.talk?.speaker) {
        currentSlotIndex++
      } else if (item.time_start !== previousItem.time_end) {
        const timeDifference = timeDiff(previousItem.time_end, item.time_start)
        if (timeDifference > 10 * 60 * 1000) {
          currentSlotIndex++
          slots[currentSlotIndex] = {
            title: 'Break',
            start_time: previousItem.time_end,
            end_time: item.time_start,
            tracks: [],
          }
          currentSlotIndex++
        }
      }
    }

    if (!slots[currentSlotIndex]) {
      slots[currentSlotIndex] = {
        tracks: [],
      }

      if (!item.talk?.speaker) {
        slots[currentSlotIndex].title = item.talk?.title
        slots[currentSlotIndex].start_time = item.time_start
        slots[currentSlotIndex].end_time = item.time_end
      }
    }

    if (!slots[currentSlotIndex].tracks[item.track.number]) {
      slots[currentSlotIndex].tracks[item.track.number] = {
        number: item.track.number,
        title: item.track.title,
        description: item.track.description || '',
        talks: [],
      }
    }

    slots[currentSlotIndex].tracks[item.track.number].talks.push(item)

    previousItem = item
  }

  return slots
}

export default async function Info() {
  const schedule = await getData()
  const slots = scheduleToSlots(schedule)

  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="container mx-auto">
            <div className="text-left">
              <h1 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 sm:text-4xl">
                Conference Program
              </h1>
              <p className="mt-4 text-lg leading-7 text-gray-600">
                Here you can find the program for Cloud Native Day Bergen.
              </p>
            </div>
          </div>

          {/* Schedule Layout */}
          <div className="container mx-auto mt-10">
            {slots.map((slot, slotIndex) =>
              slot.title ? (
                <div
                  key={slotIndex}
                  className="mb-4 rounded-lg bg-white p-4 shadow"
                >
                  <h2 className="text-lg font-bold">
                    {slot.title} {slot.start_time} - {slot.end_time}
                  </h2>
                </div>
              ) : (
                <div
                  key={slotIndex}
                  className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {slot.tracks.map((track, trackIndex) => (
                    <div
                      key={trackIndex}
                      className="rounded-lg bg-white p-4 shadow-lg"
                    >
                      <h3
                        className={classNames(
                          'text-xl font-semibold',
                          track.title === 'Platform Engineering (Teglverket)'
                            ? 'text-green-600'
                            : '',
                          track.title === 'Cloud Native Technology (Tivoli)'
                            ? 'text-red-600'
                            : '',
                          track.title === 'Observability (Storelogen)'
                            ? 'text-blue-600'
                            : '',
                        )}
                      >
                        {track.title}
                      </h3>
                      {track.talks.map((talk, talkIndex) => (
                        <div key={talkIndex} className="mt-4">
                          <p>{talk.time_start}</p>
                          <p>
                            <a
                              href={`/speaker/${talk.talk!.speaker?.slug}`}
                              className="hover:underline"
                            >
                              <span className="font-semibold">
                                {' '}
                                {talk.talk!.title}{' '}
                              </span>
                              (
                              {timeDiff(talk.time_start, talk.time_end) /
                                1000 /
                                60}{' '}
                              minutes)
                            </a>
                          </p>
                          <p className="text-gray-500">
                            by {talk.talk!.speaker?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        </Container>
      </div>
    </Layout>
  )
}

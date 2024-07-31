import { Hero } from '@/components/Hero'
import { Newsletter } from '@/components/Newsletter'
import { FeaturedSpeakers } from '@/components/FeaturedSpeakers'
import { Schedule } from '@/components/Schedule'
import { Speakers } from '@/components/Speakers'
import { Sponsors } from '@/components/Sponsors'
import { clientReadCached as clientRead } from '@/lib/sanity/client'
import { Schedule as ScheduleType, scheduleToTracks } from '@/lib/schedule'

export const revalidate = 3600

async function getData() {
  return await clientRead.fetch<ScheduleType[]>(`*[_type == "schedule"]{date, time_start, time_end, track->{number, title, description}, talk->{title, speaker->{name, title, "image": image.asset->url}}} | order(track.number asc, time_start asc)`)
}

export default async function Home() {
  const schedule = await getData()
  const tracks = scheduleToTracks(schedule)

  return (
    <>
      <Hero />
      <FeaturedSpeakers />
      {/* <Speakers tracks={tracks} /> */}
      <Schedule tracks={tracks} />
      <Sponsors />
      <Newsletter />
    </>
  )
}

export type Schedule = {
  _id: string
  date: string
  time_start: string
  time_end: string
  track: {
    number: number
    title: string
    description?: string
  }
  talk: {
    title: string
    description?: string
    speaker?: {
      name: string
      title: string
      image?: string
    }
  }
}

export type Track = {
  date: string
  number: number
  name: React.ReactNode
  title: string
  description?: string
  talks: {
    title: string
    description?: string
    start: string
    end: string
    speaker?: {
      name: string
      title: string
      image?: string
    }
  }[]
  speakers: {
    name: string
    title: string
    image?: string
  }[]
}

export function scheduleToTracks(schedule: Schedule[]): Track[] {
  const tracks: Track[] = []

  for (const scheduleItem of schedule) {
    let track = tracks.find(
      (track) => track.number === scheduleItem.track.number,
    )

    if (track) {
      track.talks.push({
        title: scheduleItem.talk.title,
        description: scheduleItem.talk.description,
        start: scheduleItem.time_start,
        end: scheduleItem.time_end,
        speaker: scheduleItem.talk.speaker,
      })
    } else {
      tracks.push({
        date: scheduleItem.date,
        number: scheduleItem.track.number,
        name: `Track ${scheduleItem.track.number}`,
        title: scheduleItem.track.title,
        description: scheduleItem.track.description,
        speakers: [],
        talks: [{
          title: scheduleItem.talk.title,
          description: scheduleItem.talk.description,
          start: scheduleItem.time_start,
          end: scheduleItem.time_end,
          speaker: scheduleItem.talk.speaker,
        }],
      })

      track = tracks[tracks.length - 1]
    }

    if (scheduleItem.talk.speaker) {
      if (!track.speakers.find((speaker) => speaker.name === scheduleItem.talk.speaker!.name)) {
        track.speakers.push(scheduleItem.talk.speaker)
      }
    }
  }

  return tracks
}
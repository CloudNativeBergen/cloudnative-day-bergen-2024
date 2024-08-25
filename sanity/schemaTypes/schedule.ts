import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'schedule',
  title: 'Schedule',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'time_start',
      title: 'Start Time',
      type: 'string',
    }),
    defineField({
      name: 'time_end',
      title: 'End Time',
      type: 'string',
    }),
    defineField({
      name: 'track',
      title: 'Track',
      type: 'reference',
      to: { type: 'track' },
    }),
    defineField({
      name: 'talk',
      title: 'Talk',
      type: 'reference',
      to: { type: 'talk' },
    }),
  ],

  preview: {
    select: {
      date: 'date',
      time_start: 'time_start',
      end_time: 'time_end',
      track: 'track.number',
      talk: 'talk.title',
      speaker: 'talk.speaker.name',
    },
    prepare(selection) {
      const { date, time_start, end_time, track, speaker, talk } = selection
      return {
        ...selection,
        title: `${date} - Track ${track} - ${time_start} - ${end_time}`,
        subtitle: `${talk} - ${speaker}`,
      }
    },
  },
})

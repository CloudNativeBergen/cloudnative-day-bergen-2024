import { define } from 'nock'
import { title } from 'process'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'conference',
  title: 'Conference',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'venue_name',
      title: 'Venue Name',
      type: 'string',
    }),
    defineField({
      name: 'venue_address',
      title: 'Venue Address',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'start_date',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'end_date',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'cfp_start_date',
      title: 'CFP Start Date',
      type: 'date',
    }),
    defineField({
      name: 'cfp_end_date',
      title: 'CFP End Date',
      type: 'date',
    }),
    defineField({
      name: 'cfp_notify_date',
      title: 'CFP Notify Date',
      type: 'date',
    }),
    defineField({
      name: 'program_date',
      title: 'Program Date',
      type: 'date',
    }),
    defineField({
      name: 'coc_link',
      title: 'Code of Conduct Link',
      type: 'string',
    }),
    defineField({
      name: 'registration_link',
      title: 'Registration Link',
      type: 'string',
    }),
    defineField({
      name: 'contact_email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'organizers',
      title: 'Organizers',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'speaker' } }],
    }),
    defineField({
      name: 'domains',
      title: 'Domains',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '' }
        ],
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      city: 'city',
      country: 'country',
      start_date: 'start_date',
      end_date: 'end_date',
    },
    prepare(selection) {
      const { title, city, country, start_date, end_date } = selection
      return {
        ...selection,
        title: `${title} - ${city}, ${country} - ${start_date} - ${end_date}`,
      }
    },
  },
})

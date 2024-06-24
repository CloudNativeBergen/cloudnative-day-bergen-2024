import { Flags } from '../../src/lib/speaker/types'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'speaker',
  title: 'Speaker',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      hidden: ({ currentUser }) => {
        return !(currentUser != null && currentUser.roles.find(({ name }) => name === 'administrator' || name === 'editor'))
      }
    }),
    defineField({
      name: 'providers',
      title: 'Profile Providers',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ currentUser }) => {
        return !(currentUser != null && currentUser.roles.find(({ name }) => name === 'administrator' || name === 'editor'))
      }
    }),
    defineField({
      name: 'imageURL',
      title: 'Image URL',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }),
    defineField({
      name: 'is_organizer',
      title: 'Is this a organizer?',
      type: 'boolean',
    }),
    defineField({
      name: 'is_featured',
      title: 'Is this as featured speaker?',
      type: 'boolean',
    }),
    defineField({
      title: 'Flags',
      description: 'Meta information about the speaker',
      name: 'flags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Is Local Speaker', value: Flags.localSpeaker },
          { title: 'Is First Time Speaker', value: Flags.firstTimeSpeaker },
          { title: 'Is Diverse Speaker', value: Flags.diverseSpeaker },
          { title: 'Requires Travel Funding', value: Flags.requiresTravelFunding },
        ]
      }
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})

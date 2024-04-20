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
        return !(currentUser != null && currentUser.roles.find(({ name }) => name === 'editor' || name === 'editor'))
      }
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
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        },
      ],
    }),
    defineField({
      name: 'is_local',
      title: 'Is local speaker?',
      type: 'boolean',
    }),
    defineField({
      name: 'is_first_time',
      title: 'Is first time speaker?',
      type: 'boolean',
    }),
    defineField({
      name: 'is_diverse',
      title: 'Is from an underrepresented group?',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})

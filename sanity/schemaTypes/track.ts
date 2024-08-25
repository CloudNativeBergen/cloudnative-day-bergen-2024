import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'track',
  title: 'Track',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],

  preview: {
    select: {
      number: 'number',
      title: 'title',
      description: 'description',
    },
    prepare(selection) {
      const { number, title, description } = selection
      return {
        ...selection,
        title: `Track ${number}: ${title}`,
        subtitle: description,
      }
    },
  },
})

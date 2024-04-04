import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'talk',
  title: 'Talk',
  type: 'document',
  fields: [
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
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'reference',
      to: [{ type: 'speaker' }],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      speaker: 'speaker.name',
    },
    prepare(selection) {
      const { title, speaker } = selection;
      return {
        ...selection,
        title: `${title} (${speaker})`,
      };
    },
  },
})

import { Format, Language, Level, Status } from '../../src/lib/proposal/types';
import { defineField, defineType } from 'sanity'
import { form } from 'sanity/structure';

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
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: Language.english },
          { title: 'Norwegian', value: Language.norwegian },
        ],
      }
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          { title: 'Lightning Talk (10 min)', value: Format.lightning_10 },
          { title: 'Presentation (25 min)', value: Format.presentation_25 },
          { title: 'Presentation (45 min)', value: Format.presentation_45 },
        ],
      }
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: Level.beginner },
          { title: 'Intermediate', value: Level.intermediate },
          { title: 'Advanced', value: Level.advanced },
        ],
      }
    }),
    defineField({
      name: 'outline',
      title: 'Outline',
      type: 'text',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'tos',
      title: 'Terms of Service',
      type: 'boolean',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: Status.submitted,
      options: {
        list: [
          { title: 'Submitted', value: Status.submitted },
          { title: 'Selected', value: Status.selected },
          { title: 'Accepted', value: Status.accepted },
          { title: 'Rejected', value: Status.rejected },
        ],
      }
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

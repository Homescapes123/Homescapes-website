import {CommentIcon} from '@sanity/icons/Comment'
import {defineField, defineType} from 'sanity'

// Clients review the studio on its Google listing. Add one here only after checking it is genuine;
// it appears on the website (up to three) once published.
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Client review',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'clientName', title: 'Client name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'City / location', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'clientRole', title: 'Role', type: 'string', description: 'Optional, e.g. "Homeowner"'}),
    defineField({name: 'projectTitle', title: 'Project', type: 'string'}),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      options: {list: [5, 4, 3, 2, 1]},
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
    defineField({name: 'review', title: 'Review', type: 'text', rows: 5, validation: (rule) => rule.required()}),
    defineField({name: 'date', title: 'Date received', type: 'date', validation: (rule) => rule.required()}),
    defineField({
      name: 'clientConfirmed',
      title: 'I have confirmed this review is from a real client',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.custom((value) => value === true || 'Confirm the reviewer is a client before publishing'),
    }),
    defineField({name: 'featured', title: 'Highlight this review', type: 'boolean', initialValue: false}),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {name: 'clientName', rating: 'rating', location: 'location'},
    prepare: ({name, rating, location}) => ({title: name, subtitle: `${'★'.repeat(rating ?? 0)} · ${location ?? ''}`}),
  },
})

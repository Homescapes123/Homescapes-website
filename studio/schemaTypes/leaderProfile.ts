import {UsersIcon} from '@sanity/icons/Users'
import {defineField, defineType} from 'sanity'
import {displayOrder, imageWithAlt} from './fields'

// About section → "Meet Our Leadership" (src/components/LeadershipSection.tsx). All profiles are shown
// side by side with equal prominence, in display order.
export const leaderProfile = defineType({
  name: 'leaderProfile',
  title: 'Leadership profile',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'name', title: 'Full name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
      description: 'Shown above the name, e.g. "Founder & Director".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Label on photo',
      type: 'string',
      description: 'One or two words on the badge under the photo, e.g. "Founder".',
      validation: (rule) => rule.required().max(20),
    }),
    imageWithAlt('photo', 'Photograph', {
      description: 'A real photograph only. Leave empty until one is available: the initials are shown instead.',
    }),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3}),
    defineField({name: 'bio', title: 'Biography', type: 'text', rows: 6}),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Short points shown with a tick. Only include what you can stand behind.',
    }),
    displayOrder,
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'designation', media: 'photo'}},
})

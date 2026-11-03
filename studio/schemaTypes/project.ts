import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {displayOrder, imageWithAlt} from './fields'

// Portfolio filters on the website (src/types.ts PortfolioCategory, minus "All").
const CATEGORIES = ['Residential', 'Commercial', 'Office', 'Luxury', 'Modern', 'Minimal', 'Kitchen', 'Bedroom', 'Living Room']

export const project = defineType({
  name: 'project',
  title: 'Portfolio project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'review', title: 'Owner review', default: true},
    {name: 'details', title: 'Details'},
    {name: 'photos', title: 'Photos'},
    {name: 'story', title: 'Story'},
  ],
  fields: [
    defineField({
      name: 'reviewStatus',
      title: 'Review status',
      type: 'string',
      group: 'review',
      description: 'Imported projects start as "Needs owner review" until you confirm the project and its photos are genuine.',
      options: {
        list: [
          {title: 'Needs owner review', value: 'needsReview'},
          {title: 'Approved: genuine project and photos', value: 'approved'},
        ],
        layout: 'radio',
      },
      initialValue: 'approved',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewNote',
      title: 'Why it was flagged',
      type: 'text',
      rows: 3,
      group: 'review',
      readOnly: true,
      hidden: ({document}) => !document?.reviewNote,
    }),
    defineField({name: 'name', title: 'Project name', type: 'string', group: 'details', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Web address name',
      type: 'slug',
      group: 'details',
      options: {source: 'name', maxLength: 80},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Portfolio filters',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'string'})],
      options: {list: CATEGORIES.map((c) => ({title: c, value: c}))},
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'details', validation: (rule) => rule.required()}),
    defineField({name: 'area', title: 'Area', type: 'string', group: 'details', description: 'e.g. "4,800 sq.ft."'}),
    defineField({name: 'style', title: 'Style', type: 'string', group: 'details'}),
    defineField({name: 'budget', title: 'Budget', type: 'string', group: 'details', description: 'Optional, e.g. "₹85,00,000+"'}),
    defineField({name: 'completionYear', title: 'Year completed', type: 'string', group: 'details'}),
    defineField({name: 'client', title: 'Client (as shown publicly)', type: 'string', group: 'details'}),
    defineField({name: 'featured', title: 'Feature on the home page', type: 'boolean', group: 'details', initialValue: false}),
    {...displayOrder, group: 'details'},
    imageWithAlt('heroImage', 'Main photo', {required: true, group: 'photos'}),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'photos',
      of: [defineArrayMember(imageWithAlt('image', 'Photo'))],
      options: {layout: 'grid'},
    }),
    imageWithAlt('beforeImage', 'Before photo', {
      group: 'photos',
      description: 'Optional. Use only together with an "After" photo of the same space.',
    }),
    imageWithAlt('afterImage', 'After photo', {group: 'photos'}),
    defineField({name: 'description', title: 'Summary', type: 'text', rows: 4, group: 'story', validation: (rule) => rule.required()}),
    defineField({name: 'challenge', title: 'The challenge', type: 'text', rows: 4, group: 'story'}),
    defineField({name: 'solution', title: 'Our solution', type: 'text', rows: 4, group: 'story'}),
    defineField({name: 'materialsUsed', title: 'Materials used', type: 'array', group: 'story', of: [{type: 'string'}]}),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', location: 'location', status: 'reviewStatus', media: 'heroImage'},
    prepare: ({title, location, status, media}) => ({
      title,
      subtitle: `${status === 'needsReview' ? '⚠ Needs owner review · ' : ''}${location ?? ''}`,
      media,
    }),
  },
})

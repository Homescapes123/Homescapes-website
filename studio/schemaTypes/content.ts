import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {ImagesIcon} from '@sanity/icons/Images'
import {SparklesIcon} from '@sanity/icons/Sparkles'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {displayOrder, imageWithAlt} from './fields'

// Icons available on the website's service cards (src/components/ServicesSection.tsx).
const SERVICE_ICONS = ['Home', 'Building2', 'ChefHat', 'Bed', 'Sofa', 'Briefcase', 'Eye', 'Hammer', 'Key', 'LayoutGrid']

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 2, validation: (rule) => rule.required()}),
    defineField({name: 'fullDescription', title: 'Full description', type: 'text', rows: 5}),
    defineField({name: 'iconName', title: 'Icon', type: 'string', options: {list: SERVICE_ICONS}, initialValue: 'Home'}),
    defineField({name: 'features', title: 'Features', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'deliverables', title: 'Deliverables', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'estimatedTimeline', title: 'Typical timeline', type: 'string'}),
    defineField({name: 'startingPrice', title: 'Starting price', type: 'string', description: 'Optional'}),
    imageWithAlt('image', 'Image'),
    displayOrder,
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'estimatedTimeline', media: 'image'}},
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 5, validation: (rule) => rule.required()}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: ['Cost', 'Timeline', 'Design Process', 'Consultation', 'Materials', 'Warranty']},
      validation: (rule) => rule.required(),
    }),
    displayOrder,
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'category'}},
})

// "Before & After" section: hidden on the website while this list is empty.
export const beforeAfterPair = defineType({
  name: 'beforeAfterPair',
  title: 'Before & after',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    imageWithAlt('before', 'Before photo', {required: true, description: 'Your own photograph of the space before the work.'}),
    imageWithAlt('after', 'After photo', {required: true, description: 'Your own photograph of the same space afterwards.'}),
    defineField({name: 'details', title: 'What changed', type: 'text', rows: 3}),
    displayOrder,
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'location', media: 'after'}},
})

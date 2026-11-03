import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

// Single document: the studio's contact details and headline figures used across the website.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Studio details',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'email',
      title: 'Public email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone (as displayed)',
      type: 'string',
      description: 'e.g. "+91 7380334333"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description: 'Digits only with country code, e.g. 917380334333',
      validation: (rule) => rule.required().regex(/^\d{8,15}$/, {name: 'digits'}),
    }),
    defineField({name: 'addressLines', title: 'Studio address', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'openingHours', title: 'Opening hours', type: 'string', description: 'e.g. "Mon – Sat: 9:00 AM – 9:00 PM IST"'}),
    defineField({name: 'instagramUrl', title: 'Instagram link', type: 'url'}),
    defineField({
      name: 'statistics',
      title: 'Headline figures',
      type: 'array',
      description: 'Numbers such as projects completed. Only include figures you can back up; remove any you cannot.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statistic',
          fields: [
            defineField({name: 'value', title: 'Figure', type: 'string', description: 'e.g. "40+"', validation: (rule) => rule.required()}),
            defineField({name: 'label', title: 'Label', type: 'string', description: 'e.g. "Projects completed"', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Studio details'})},
})

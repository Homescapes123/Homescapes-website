import {defineField} from 'sanity'

// An image with focal-point cropping and a required description for screen readers and search engines.
export function imageWithAlt(
  name: string,
  title: string,
  options: {description?: string; required?: boolean; group?: string} = {},
) {
  return defineField({
    name,
    title,
    type: 'image',
    group: options.group,
    description: options.description,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Image description',
        type: 'string',
        description: 'What the photo shows, e.g. "Living room with a marble fireplace". Read aloud to blind visitors.',
        validation: (rule) =>
          rule.custom((alt, context) => {
            const image = context.parent as {asset?: unknown} | undefined
            return image?.asset && !alt ? 'Describe the photo' : true
          }),
      }),
    ],
    validation: options.required ? (rule) => rule.required() : undefined,
  })
}

export const displayOrder = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers appear first.',
  initialValue: 10,
  validation: (rule) => rule.integer().min(0),
})

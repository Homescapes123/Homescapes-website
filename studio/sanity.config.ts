import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes, SINGLETON_TYPES} from './schemaTypes'
import {structure} from './structure'

// Set SANITY_STUDIO_PROJECT_ID in studio/.env once the business has created its Sanity project
// (see README.md). Until then the Studio builds but cannot sign in or load content.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'homescapes',
  title: 'Homescapes Studio · Website',
  projectId,
  dataset,
  plugins: [structureTool({structure})],
  schema: {
    types: schemaTypes,
    // Singletons are opened from the sidebar, never created again from "New document".
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({action}) => action === 'publish' || action === 'discardChanges' || action === 'restore')
        : actions,
  },
})

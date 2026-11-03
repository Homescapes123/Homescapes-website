import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // `sanity deploy` publishes the Studio at https://<studioHost>.sanity.studio (sign-in required).
  studioHost: process.env.SANITY_STUDIO_HOST || undefined,
  deployment: {autoUpdates: true},
})

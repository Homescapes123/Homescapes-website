import {beforeAfterPair, faq, service} from './content'
import {leaderProfile} from './leaderProfile'
import {project} from './project'
import {siteSettings} from './siteSettings'
import {testimonial} from './testimonial'

export const schemaTypes = [siteSettings, leaderProfile, project, beforeAfterPair, testimonial, service, faq]

// Document types with exactly one document, edited from a fixed sidebar entry.
export const SINGLETON_TYPES = new Set(['siteSettings'])

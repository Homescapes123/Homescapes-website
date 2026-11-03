// Builds seed/content.ndjson: the website's current content as Sanity documents, for a one-time
//   npx sanity dataset import seed/content.ndjson production --missing
// once the business's Sanity project exists. Nothing is uploaded by this script.
//
// Sources: the verified legacy backup (backups/legacy-cms-2026-11-03) plus content that lives in
// website components (contact details, figures, leadership). Every imported portfolio project is
// marked "Needs owner review" with the reason from review-flags.json. The stock before/after pairs
// of foreign projects are deliberately not imported.

import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const studioDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(studioDir, '..')
const backupDir = path.join(repoRoot, 'backups/legacy-cms-2026-11-03')
const outFile = path.join(studioDir, 'seed/content.ndjson')

const {content} = JSON.parse(readFileSync(path.join(backupDir, 'content.json'), 'utf8'))
const flags = JSON.parse(readFileSync(path.join(backupDir, 'review-flags.json'), 'utf8'))

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

// Remote URLs are fetched by `sanity dataset import`; repo files are read from disk.
const image = (source, alt) => ({
  _type: 'image',
  _sanityAsset: `image@${/^https?:\/\//.test(source) ? source : pathToFileURL(path.join(repoRoot, source)).href}`,
  alt,
})
const keyed = (items) => items.map((item, i) => (typeof item === 'object' ? {_key: `k${i}`, ...item} : item))

const docs = []

// Contact details and figures as currently shown in Footer.tsx, Header.tsx and AboutSection.tsx.
docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  email: 'workwithhomescapes@gmail.com',
  phone: '+91 7380334333',
  whatsappNumber: '917380334333',
  addressLines: ['Indira Nagar, Sugamau', 'Lucknow, Uttar Pradesh 226016, India'],
  openingHours: 'Mon – Sat: 9:00 AM – 9:00 PM IST',
  instagramUrl: 'https://instagram.com/homescapes.studio/',
  statistics: keyed([
    {_type: 'statistic', value: '3+', label: 'Years experience'},
    {_type: 'statistic', value: '40+', label: 'Projects completed'},
    {_type: 'statistic', value: '98%', label: 'Satisfaction rate'},
  ]),
})

// Leadership: keep in step with INITIAL_LEADERSHIP in src/data/initialData.ts.
const founder = content.founder
docs.push(
  {
    _id: 'leader-hariom-srivastava',
    _type: 'leaderProfile',
    name: founder.name,
    designation: 'Founder & Director',
    shortTitle: 'Founder',
    photo: image(founder.photo, `${founder.name}, Founder & Director of Homescapes Studio`),
    quote: founder.quote,
    bio: founder.bio,
    highlights: founder.achievements,
    order: 1,
  },
  {
    _id: 'leader-yashdeep-singh',
    _type: 'leaderProfile',
    name: 'Yashdeep Singh',
    designation: 'Co-Founder & Director',
    shortTitle: 'Co-Founder',
    bio: 'As Co-Founder & Director, Yashdeep Singh leads Homescapes Studio together with founder Hariom Srivastava from the studio in Indira Nagar, Sugamau, Lucknow.',
    order: 2,
  },
)

const flagsById = new Map(flags.projects.map((flag) => [flag.id, flag]))
content.projects.forEach((p, index) => {
  const flag = flagsById.get(p.id)
  const stockCount = flag?.images.filter((img) => img.source.startsWith('stock')).length ?? 0
  docs.push({
    _id: `project-${p.id}`,
    _type: 'project',
    reviewStatus: flag ? 'needsReview' : 'approved',
    reviewNote: flag
      ? `Imported from the old website. ${flag.allImagesStock ? `All ${stockCount} photos are` : `${stockCount} photos are`} stock images, not photographs of this project. ${flag.ownerAction}`
      : undefined,
    name: p.name,
    slug: {_type: 'slug', current: slugify(p.name)},
    categories: p.category,
    location: p.location,
    area: p.area,
    style: p.style,
    budget: p.budget,
    completionYear: p.completionYear,
    client: p.client,
    featured: Boolean(p.featured),
    order: index + 1,
    heroImage: image(p.heroImage, p.name),
    gallery: keyed(p.galleryImages.map((url, i) => image(url, `${p.name}, photo ${i + 1}`))),
    ...(p.beforeImage && p.afterImage
      ? {beforeImage: image(p.beforeImage, `${p.name}, before`), afterImage: image(p.afterImage, `${p.name}, after`)}
      : {}),
    description: p.description,
    challenge: p.challenge,
    solution: p.solution,
    materialsUsed: p.materialsUsed,
  })
})

content.services.forEach((s, index) => {
  docs.push({
    _id: `service-${s.id}`,
    _type: 'service',
    title: s.title,
    shortDescription: s.shortDescription,
    fullDescription: s.fullDescription,
    iconName: s.iconName,
    features: s.features,
    deliverables: s.deliverables,
    estimatedTimeline: s.estimatedTimeline,
    startingPrice: s.startingPrice,
    image: image(s.image, s.title),
    order: index + 1,
  })
})

content.faqs.forEach((f, index) => {
  docs.push({_id: `faq-${f.id}`, _type: 'faq', question: f.question, answer: f.answer, category: f.category, order: index + 1})
})

// Reviews: the old site had none; genuine ones are added by the owner after approval.
// Before & after: the old pairs were stock photos of foreign projects, so none are imported.

// Drop undefined values so the NDJSON only carries real content.
const clean = (value) => JSON.parse(JSON.stringify(value))
mkdirSync(path.dirname(outFile), {recursive: true})
writeFileSync(outFile, docs.map((doc) => JSON.stringify(clean(doc))).join('\n') + '\n')

const count = (type) => docs.filter((d) => d._type === type).length
const flagged = docs.filter((d) => d.reviewStatus === 'needsReview').length
const imageCount = (JSON.stringify(docs).match(/"_sanityAsset"/g) ?? []).length
console.log(`Wrote ${path.relative(repoRoot, outFile)}: ${docs.length} documents, ${imageCount} images`)
console.log(
  `  siteSettings ${count('siteSettings')}, leaderProfile ${count('leaderProfile')}, project ${count('project')} ` +
    `(${flagged} need owner review), service ${count('service')}, faq ${count('faq')}, ` +
    `testimonial ${count('testimonial')}, beforeAfterPair ${count('beforeAfterPair')}`,
)

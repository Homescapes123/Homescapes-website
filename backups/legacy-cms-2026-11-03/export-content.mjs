// One-off backup of all content managed by the legacy PIN admin (before its removal).
//
//   node backups/legacy-cms-2026-11-03/export-content.mjs          -> writes content.json + review-flags.json
//   node backups/legacy-cms-2026-11-03/export-content.mjs --verify -> re-reads the sources and checks content.json matches
//
// Sources are read from the working tree, so run --verify against the tagged commit
// (git checkout backup/pre-admin-removal) if the source files have since changed.

import { build } from 'esbuild';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

const FOUNDER_IMAGES = [
  'src/assets/images/hariom_srivastava_founder_1785395029579.jpg',
  'src/assets/images/hariom_srivastava_1785394825080.jpg'
];

// Bundle initialData.ts + the founder defaults so we read the exact values the site ships.
async function loadModuleContent() {
  const dir = mkdtempSync(path.join(tmpdir(), 'hs-export-'));
  const outfile = path.join(dir, 'content.mjs');
  try {
    await build({
      stdin: {
        contents: [
          "export * from './src/data/initialData.ts';",
          "export { DEFAULT_FOUNDER_DATA } from './src/context/StudioContext.tsx';"
        ].join('\n'),
        resolveDir: root,
        loader: 'ts'
      },
      bundle: true,
      platform: 'node',
      format: 'esm',
      jsx: 'automatic',
      outfile,
      logLevel: 'silent',
      plugins: [{
        // Image imports become their repo-relative path instead of a bundled asset.
        name: 'asset-path',
        setup(b) {
          b.onLoad({ filter: /\.(jpe?g|png|webp|svg)$/ }, args => ({
            contents: `export default ${JSON.stringify(path.relative(root, args.path))};`,
            loader: 'js'
          }));
        }
      }]
    });
    return await import(pathToFileURL(outfile).href);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// The before/after pairs live inside the component, not initialData.ts.
function loadBeforeAfterPairs() {
  const file = path.join(root, 'src/components/BeforeAfterSlider.tsx');
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  let literal;
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'pairs' && node.initializer) {
      literal = node.initializer.getText();
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!literal) throw new Error('Could not find `pairs` in BeforeAfterSlider.tsx');
  return new Function(`return (${literal});`)();
}

async function loadSourceContent() {
  const mod = await loadModuleContent();
  return {
    founder: mod.DEFAULT_FOUNDER_DATA,
    projects: mod.INITIAL_PROJECTS,
    services: mod.INITIAL_SERVICES,
    testimonials: mod.INITIAL_TESTIMONIALS,
    processSteps: mod.INITIAL_PROCESS,
    faqs: mod.INITIAL_FAQS,
    blogPosts: mod.INITIAL_BLOG_POSTS,
    instagramPosts: mod.INITIAL_INSTAGRAM_POSTS,
    beforeAfterPairs: loadBeforeAfterPairs()
  };
}

const sha256 = rel => createHash('sha256').update(readFileSync(path.join(root, rel))).digest('hex');

function classifyImage(url) {
  if (/images\.unsplash\.com/.test(url)) return 'stock (Unsplash)';
  if (url.startsWith('src/assets/')) return 'repo asset';
  return 'other';
}

function buildFlags(content) {
  const projects = content.projects.map(p => {
    const images = [
      { role: 'hero', url: p.heroImage },
      ...p.galleryImages.map((url, i) => ({ role: `gallery ${i + 1}`, url })),
      ...(p.beforeImage ? [{ role: 'before', url: p.beforeImage }] : []),
      ...(p.afterImage ? [{ role: 'after', url: p.afterImage }] : [])
    ].map(img => ({ ...img, source: classifyImage(img.url) }));
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      client: p.client,
      completionYear: p.completionYear,
      featured: Boolean(p.featured),
      images,
      allImagesStock: images.every(img => img.source.startsWith('stock')),
      ownerAction: 'Confirm this is a real Homescapes project and supply genuine photos, or unpublish it.'
    };
  });

  const beforeAfterPairs = content.beforeAfterPairs.map(pair => ({
    title: pair.title,
    location: pair.location,
    before: { url: pair.before, source: classifyImage(pair.before) },
    after: { url: pair.after, source: classifyImage(pair.after) },
    ownerAction: 'Stock photos captioned as foreign projects (outside India). Hide until real before/after pairs exist.'
  }));

  const otherStock = [
    ...content.services.map(s => ({ section: 'services', item: s.title, url: s.image })),
    ...content.instagramPosts.map(p => ({ section: 'instagram feed', item: p.caption.slice(0, 60), url: p.imageUrl })),
    ...content.blogPosts.map(b => ({ section: 'blog (unused)', item: b.title, url: b.coverImage }))
  ].map(x => ({ ...x, source: classifyImage(x.url) })).filter(x => x.source.startsWith('stock'));

  return { projects, beforeAfterPairs, otherStock };
}

const contentPath = path.join(here, 'content.json');
const flagsPath = path.join(here, 'review-flags.json');
const content = await loadSourceContent();

if (process.argv.includes('--verify')) {
  const saved = JSON.parse(readFileSync(contentPath, 'utf8'));
  const failures = [];
  // Compare through a JSON round-trip, which is exactly what content.json can hold.
  const live = JSON.parse(JSON.stringify(content));
  for (const key of Object.keys(live)) {
    if (!isDeepStrictEqual(saved.content[key], live[key])) failures.push(`content.${key} differs from source`);
  }
  for (const [rel, hash] of Object.entries(saved.meta.fileChecksums)) {
    if (sha256(rel) !== hash) failures.push(`checksum mismatch: ${rel}`);
  }
  const counts = Object.fromEntries(Object.entries(live).map(([k, v]) => [k, Array.isArray(v) ? v.length : 1]));
  console.log('counts:', counts);
  if (failures.length) {
    console.error('BACKUP VERIFY FAILED:\n- ' + failures.join('\n- '));
    process.exit(1);
  }
  console.log('BACKUP VERIFIED: content.json matches the source modules and all checksums match.');
} else {
  const meta = {
    exportedAt: new Date().toISOString(),
    sourceTag: 'backup/pre-admin-removal',
    sourceFiles: ['src/data/initialData.ts', 'src/context/StudioContext.tsx (DEFAULT_FOUNDER_DATA)', 'src/components/BeforeAfterSlider.tsx (pairs)'],
    fileChecksums: Object.fromEntries(FOUNDER_IMAGES.map(rel => [rel, sha256(rel)]))
  };
  writeFileSync(contentPath, JSON.stringify({ meta, content }, null, 2) + '\n');
  writeFileSync(flagsPath, JSON.stringify(buildFlags(content), null, 2) + '\n');
  console.log(`wrote ${path.relative(root, contentPath)} and ${path.relative(root, flagsPath)}`);
}

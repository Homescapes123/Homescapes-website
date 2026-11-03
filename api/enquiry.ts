// Vercel Function: receives website form submissions and emails them to the studio via Resend.
// Nothing is stored here or in the browser; the studio inbox is the record of every enquiry.
//
// Abuse protection, cheapest first: same-origin check, size limit, honeypot, field validation,
// per-IP rate limit, then Vercel BotID. The shared rate limit lives in the Vercel Firewall (docs/DEPLOYMENT.md).
//
// Env (server-only, never prefixed with VITE_):
//   RESEND_API_KEY      Resend API key
//   ENQUIRY_FROM_EMAIL  sender on a Resend-verified domain, e.g. "Homescapes Website <enquiries@homescapes.studio>"
//   ENQUIRY_TO_EMAIL    recipient (defaults to the studio address published on the site)
//   ENQUIRY_DRY_RUN=1   log the email instead of sending it (ignored in production)
//   BOTID_DEV_BYPASS    local development only: HUMAN (default) or BAD-BOT; BotID ignores it in production

import { createHash } from 'node:crypto';
import { checkBotId } from 'botid/server';

export const config = { maxDuration: 15 };

type Kind = 'booking' | 'contact' | 'review';

interface FieldRule {
  label: string;
  max: number;
  required?: boolean;
  format?: 'email' | 'phone' | 'date' | 'rating';
}

const FIELDS: Record<Kind, Record<string, FieldRule>> = {
  booking: {
    name: { label: 'Name', max: 100, required: true },
    email: { label: 'Email', max: 254, required: true, format: 'email' },
    phone: { label: 'Phone', max: 30, format: 'phone' },
    location: { label: 'Project location', max: 200 },
    preferredDate: { label: 'Preferred date', max: 10, required: true, format: 'date' },
    preferredTime: { label: 'Preferred time', max: 30, required: true },
    projectType: { label: 'Project type', max: 100 },
    estimatedBudget: { label: 'Budget', max: 60 },
    notes: { label: 'Notes', max: 3000 }
  },
  contact: {
    name: { label: 'Name', max: 100, required: true },
    email: { label: 'Email', max: 254, required: true, format: 'email' },
    phone: { label: 'Phone', max: 30, format: 'phone' },
    projectType: { label: 'Project type', max: 100 },
    budget: { label: 'Budget', max: 60 },
    message: { label: 'Message', max: 3000 }
  },
  review: {
    name: { label: 'Name', max: 100, required: true },
    location: { label: 'City / location', max: 100, required: true },
    rating: { label: 'Rating', max: 1, required: true, format: 'rating' },
    review: { label: 'Review', max: 3000, required: true },
    projectTitle: { label: 'Project', max: 150 },
    clientRole: { label: 'Role', max: 100 },
    contact: { label: 'Private contact (for verification)', max: 254 }
  }
};

const SUBJECTS: Record<Kind, (f: Record<string, string>) => string> = {
  booking: f => `New consultation request: ${f.name}`,
  contact: f => `New website enquiry: ${f.name}`,
  review: f => `Review awaiting approval: ${f.name} (${f.rating}/5)`
};

const INTROS: Record<Kind, string> = {
  booking: 'A visitor requested a consultation on the website. The appointment is not confirmed until you reply.',
  contact: 'A visitor sent an enquiry through the website contact form.',
  review: 'A visitor submitted a review. It is not published. Add it to the website only if you approve it.'
};

const DEFAULT_TO = 'workwithhomescapes@gmail.com';
const MAX_BODY_BYTES = 16 * 1024;
const HONEYPOT = 'hs_hp';
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const BOT_CHECK_TIMEOUT_MS = 5000;

// Messages shown to the visitor next to the WhatsApp / phone / email fallbacks.
const MESSAGES = {
  forbidden: 'Please send this form from the Homescapes Studio website.',
  rateLimited: "You've sent several requests in a short time. Please wait a few minutes before trying again.",
  bot: "We couldn't verify this request automatically."
};

const json = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers }
  });

// Only same-origin browser requests: browsers always send Origin on POST, and Sec-Fetch-Site when they support it.
// Comparing against the request's own host keeps this correct on production, preview and localhost alike.
function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return false;
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false; // malformed Origin header
  }
}

// Vercel overwrites x-real-ip / x-forwarded-for with the client's address, so they can't be spoofed there.
const clientIp = (request: Request) =>
  request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

// Best effort: counts are per function instance (Fluid compute reuses instances), so this stops bursts
// from one address; the Vercel Firewall rate-limit rule is the limit shared across instances.
const recentByIp = new Map<string, number[]>();

function retryAfterSeconds(ip: string, now = Date.now()): number | null {
  const recent = (recentByIp.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (recentByIp.size > 5000) {
    for (const [key, times] of recentByIp) if (times.every(t => now - t >= RATE_WINDOW_MS)) recentByIp.delete(key);
  }
  if (recent.length >= RATE_LIMIT) {
    recentByIp.set(ip, recent);
    return Math.ceil((recent[0] + RATE_WINDOW_MS - now) / 1000);
  }
  recentByIp.set(ip, [...recent, now]);
  return null;
}

// Vercel BotID validates the invisible browser challenge attached by initBotId() in src/main.tsx.
// If the check itself fails (misconfiguration or outage) the enquiry goes through: losing a client's
// request is worse than one spam email, and the rate limits still apply.
async function isBot(): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timed out')), BOT_CHECK_TIMEOUT_MS);
  });
  try {
    const bypass = process.env.BOTID_DEV_BYPASS === 'BAD-BOT' ? 'BAD-BOT' : 'HUMAN';
    const verification = await Promise.race([checkBotId({ developmentOptions: { bypass } }), timeout]);
    return verification.isBot;
  } catch (err) {
    console.error('[enquiry] BotID check failed; allowing the enquiry:', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

function validateField(rule: FieldRule, value: string): string | null {
  if (!value) return rule.required ? `${rule.label} is required.` : null;
  if (value.length > rule.max) return `${rule.label} is too long.`;
  switch (rule.format) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please enter a valid email address.';
    case 'phone':
      return /^\+?[\d\s()-]{6,}$/.test(value) ? null : 'Please enter a valid phone number.';
    case 'rating':
      return /^[1-5]$/.test(value) ? null : 'Please choose a rating from 1 to 5.';
    case 'date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) return 'Please choose a valid date.';
      // Allow "today" in any Indian/UTC offset by comparing against yesterday (UTC).
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      return value >= yesterday ? null : 'Please choose a date that is not in the past.';
    }
    default:
      return null;
  }
}

function renderEmail(kind: Kind, fields: Record<string, string>, subject: string, host: string) {
  const rules = FIELDS[kind];
  const receivedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const rows = Object.entries(rules)
    .filter(([key]) => fields[key])
    .map(([key, rule]) => [rule.label, fields[key]] as const);

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;color:#1F1F1F">
  <h2 style="font-weight:normal;margin:0 0 8px">${escapeHtml(subject)}</h2>
  <p style="color:#555;margin:0 0 16px">${escapeHtml(INTROS[kind])}</p>
  <table style="border-collapse:collapse;width:100%">${rows
    .map(([label, value]) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;color:#8a6a3f;width:180px;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`)
    .join('')}
  </table>
  <p style="color:#888;font-size:12px;margin-top:16px">Received ${escapeHtml(receivedAt)} IST via ${escapeHtml(host)}${
    fields.email ? '. Reply to this email to answer the client directly.' : '.'
  }</p>
</div>`;

  const text = [subject, INTROS[kind], '', ...rows.map(([label, value]) => `${label}: ${value}`), '', `Received ${receivedAt} IST via ${host}`].join('\n');
  return { html, text };
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return json(403, { ok: false, error: MESSAGES.forbidden });

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'Submission is too large.' });

  let payload: { kind?: unknown; fields?: unknown; [HONEYPOT]?: unknown };
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  const kind = payload.kind as Kind;
  if (!Object.hasOwn(FIELDS, kind) || typeof payload.fields !== 'object' || payload.fields === null) {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  // Bots fill the hidden field; pretend success so they don't retry, but send nothing.
  if (typeof payload[HONEYPOT] === 'string' && payload[HONEYPOT].trim() !== '') return json(200, { ok: true });

  const input = payload.fields as Record<string, unknown>;
  const fields: Record<string, string> = {};
  for (const [key, rule] of Object.entries(FIELDS[kind])) {
    const value = typeof input[key] === 'string' || typeof input[key] === 'number' ? String(input[key]).trim() : '';
    const error = validateField(rule, value);
    if (error) return json(400, { ok: false, error });
    if (value) fields[key] = value;
  }

  const retryAfter = retryAfterSeconds(clientIp(request));
  if (retryAfter !== null) return json(429, { ok: false, error: MESSAGES.rateLimited }, { 'Retry-After': String(retryAfter) });

  if (await isBot()) return json(403, { ok: false, error: MESSAGES.bot });

  const isProduction = process.env.VERCEL_ENV === 'production';
  // Preview deployments email the same inbox unless ENQUIRY_TO_EMAIL is scoped to Preview, so label them.
  const subject = (process.env.VERCEL_ENV === 'preview' ? '[Preview] ' : '') + SUBJECTS[kind](fields).replace(/[\r\n]+/g, ' ');
  const { html, text } = renderEmail(kind, fields, subject, new URL(request.url).host);

  if (process.env.ENQUIRY_DRY_RUN === '1' && !isProduction) {
    console.info(`[enquiry dry run] ${subject}\n${text}`);
    return json(200, { ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('[enquiry] RESEND_API_KEY or ENQUIRY_FROM_EMAIL is not set; enquiry could not be sent.');
    return json(503, { ok: false, error: 'unavailable' });
  }

  // Identical submissions (double clicks, retries) share a key, so Resend sends them once.
  const idempotencyKey = 'enquiry-' + createHash('sha256').update(kind + JSON.stringify(fields)).digest('hex').slice(0, 48);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        from,
        to: [process.env.ENQUIRY_TO_EMAIL || DEFAULT_TO],
        ...(fields.email ? { reply_to: fields.email } : {}),
        subject,
        html,
        text,
        tags: [{ name: 'kind', value: kind }]
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
      console.error(`[enquiry] Resend rejected the email: ${response.status} ${await response.text()}`);
      return json(502, { ok: false, error: 'unavailable' });
    }
  } catch (err) {
    console.error('[enquiry] Could not reach Resend:', err);
    return json(502, { ok: false, error: 'unavailable' });
  }

  return json(200, { ok: true });
}

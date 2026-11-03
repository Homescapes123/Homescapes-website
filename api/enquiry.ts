// Vercel Function: receives website form submissions and emails them to the studio via Resend.
// Nothing is stored here or in the browser; the studio inbox is the record of every enquiry.
//
// Env (server-only, never prefixed with VITE_):
//   RESEND_API_KEY      Resend API key
//   ENQUIRY_FROM_EMAIL  sender on a Resend-verified domain, e.g. "Homescapes Website <enquiries@homescapes.studio>"
//   ENQUIRY_TO_EMAIL    recipient (defaults to the studio address published on the site)
//   ENQUIRY_DRY_RUN=1   log the email instead of sending it (ignored in production)

import { createHash } from 'node:crypto';

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

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

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

function renderEmail(kind: Kind, fields: Record<string, string>) {
  const rules = FIELDS[kind];
  const receivedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const rows = Object.entries(rules)
    .filter(([key]) => fields[key])
    .map(([key, rule]) => [rule.label, fields[key]] as const);

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;color:#1F1F1F">
  <h2 style="font-weight:normal;margin:0 0 8px">${escapeHtml(SUBJECTS[kind](fields))}</h2>
  <p style="color:#555;margin:0 0 16px">${escapeHtml(INTROS[kind])}</p>
  <table style="border-collapse:collapse;width:100%">${rows
    .map(([label, value]) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;color:#8a6a3f;width:180px;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`)
    .join('')}
  </table>
  <p style="color:#888;font-size:12px;margin-top:16px">Received ${escapeHtml(receivedAt)} IST via www.homescapes.studio${
    fields.email ? '. Reply to this email to answer the client directly.' : '.'
  }</p>
</div>`;

  const text = [SUBJECTS[kind](fields), INTROS[kind], '', ...rows.map(([label, value]) => `${label}: ${value}`), '', `Received ${receivedAt} IST`].join('\n');
  return { html, text };
}

export async function POST(request: Request): Promise<Response> {
  // Browsers always send Origin on cross-site POSTs; only accept submissions from this site.
  const origin = request.headers.get('origin');
  if (origin) {
    let sameHost = false;
    try {
      sameHost = new URL(origin).host === new URL(request.url).host;
    } catch {
      // malformed Origin header
    }
    if (!sameHost) return json(403, { ok: false, error: 'Forbidden.' });
  }

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

  const { html, text } = renderEmail(kind, fields);
  const subject = SUBJECTS[kind](fields).replace(/[\r\n]+/g, ' ');
  const isProduction = process.env.VERCEL_ENV === 'production';

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

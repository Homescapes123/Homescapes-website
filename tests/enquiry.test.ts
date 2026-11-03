// Unit tests for api/enquiry.ts with Resend stubbed out. Run: bun run test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../api/enquiry.ts');
const { POST } = mod;

const URL_ = 'https://www.homescapes.studio/api/enquiry';
const future = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
const past = new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10);
const booking = {
  name: 'Asha <script>alert(1)</script>',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  location: 'Gomti Nagar, Lucknow',
  preferredDate: future,
  preferredTime: '10:00 AM IST',
  projectType: 'Residential Interiors',
  estimatedBudget: '₹10,00,000 - ₹25,00,000',
  notes: 'Line1\nLine2 & "quotes"'
};

// Each request gets its own client address unless a test sets x-real-ip, so rate limiting stays out of the way.
let ipCounter = 0;
const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request(URL_, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.homescapes.studio',
      'sec-fetch-site': 'same-origin',
      'x-real-ip': `203.0.113.${++ipCounter % 250}:${ipCounter}`,
      ...headers
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });

let calls: { url: string; init: RequestInit }[] = [];
function stubResend(status = 200, body: unknown = { id: 'abc' }) {
  calls = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
}
const sent = () => JSON.parse(calls[0].init.body as string);
const headerOf = (name: string) => new Headers(calls[0].init.headers).get(name);

beforeEach(() => {
  delete process.env.ENQUIRY_DRY_RUN;
  delete process.env.VERCEL_ENV;
  delete process.env.ENQUIRY_TO_EMAIL;
  delete process.env.BOTID_DEV_BYPASS;
  process.env.RESEND_API_KEY = 're_test';
  process.env.ENQUIRY_FROM_EMAIL = 'Homescapes Website <enquiries@homescapes.studio>';
  stubResend();
});

test('valid booking is emailed via Resend with escaping, reply-to and idempotency key', async () => {
  const res = await POST(req({ kind: 'booking', fields: booking, hs_hp: '' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(headerOf('authorization'), 'Bearer re_test');
  assert.match(headerOf('idempotency-key')!, /^enquiry-[0-9a-f]{48}$/);
  const body = sent();
  assert.deepEqual(body.to, ['workwithhomescapes@gmail.com']);
  assert.equal(body.reply_to, 'asha@example.com');
  assert.equal(body.from, 'Homescapes Website <enquiries@homescapes.studio>');
  assert.ok(!body.html.includes('<script>'), 'raw <script> must not appear in html');
  assert.ok(body.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(body.html.includes('&amp; &quot;quotes&quot;'));
  assert.ok(body.text.includes('Preferred date: ' + future));
  assert.ok(!/[\r\n]/.test(body.subject));
  assert.deepEqual(body.tags, [{ name: 'kind', value: 'booking' }]);
});

test('ENQUIRY_TO_EMAIL overrides the recipient', async () => {
  process.env.ENQUIRY_TO_EMAIL = 'owner@example.com';
  await POST(req({ kind: 'contact', fields: { name: 'Ravi', email: 'ravi@example.com', message: 'Hi' } }));
  assert.deepEqual(sent().to, ['owner@example.com']);
});

test('identical submissions share an idempotency key; changed ones do not', async () => {
  await POST(req({ kind: 'booking', fields: booking }));
  const k1 = headerOf('idempotency-key');
  stubResend();
  await POST(req({ kind: 'booking', fields: booking }));
  const k2 = headerOf('idempotency-key');
  stubResend();
  await POST(req({ kind: 'booking', fields: { ...booking, notes: 'changed' } }));
  const k3 = headerOf('idempotency-key');
  assert.equal(k1, k2);
  assert.notEqual(k1, k3);
});

test('honeypot filled -> 200 but nothing sent', async () => {
  const res = await POST(req({ kind: 'booking', fields: booking, hs_hp: 'http://spam' }));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('invalid email -> 400 with visitor-facing message', async () => {
  const res = await POST(req({ kind: 'booking', fields: { ...booking, email: 'not-an-email' } }));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'Please enter a valid email address.');
  assert.equal(calls.length, 0);
});

test('missing required field -> 400', async () => {
  const res = await POST(req({ kind: 'contact', fields: { email: 'a@b.co' } }));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'Name is required.');
});

test('past preferred date -> 400', async () => {
  const res = await POST(req({ kind: 'booking', fields: { ...booking, preferredDate: past } }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /past/);
});

test('bad phone -> 400; review rating outside 1-5 -> 400', async () => {
  assert.equal((await POST(req({ kind: 'contact', fields: { name: 'A', email: 'a@b.co', phone: 'N/A' } }))).status, 400);
  assert.equal((await POST(req({ kind: 'review', fields: { name: 'A', location: 'Lucknow', rating: 9, review: 'x' } }))).status, 400);
});

test('valid review is emailed for approval and says it is unpublished', async () => {
  const res = await POST(req({ kind: 'review', fields: { name: 'Meera', location: 'Lucknow', rating: 5, review: 'Lovely work' } }));
  assert.equal(res.status, 200);
  const body = sent();
  assert.equal(body.subject, 'Review awaiting approval: Meera (5/5)');
  assert.ok(body.text.includes('It is not published'));
  assert.equal(body.reply_to, undefined);
});

test('unknown kind, non-object fields, invalid JSON -> 400', async () => {
  assert.equal((await POST(req({ kind: 'admin', fields: {} }))).status, 400);
  assert.equal((await POST(req({ kind: 'toString', fields: {} }))).status, 400);
  assert.equal((await POST(req({ kind: 'booking', fields: 'x' }))).status, 400);
  assert.equal((await POST(req('{not json'))).status, 400);
});

test('oversized body -> 413', async () => {
  const res = await POST(req({ kind: 'contact', fields: { name: 'A', email: 'a@b.co', message: 'x'.repeat(20000) } }));
  assert.equal(res.status, 413);
});

test('over-long field -> 400', async () => {
  const res = await POST(req({ kind: 'contact', fields: { name: 'A', email: 'a@b.co', message: 'x'.repeat(3001) } }));
  assert.equal(res.status, 400);
});

test('only same-origin browser requests are accepted', async () => {
  const cross = await POST(req({ kind: 'booking', fields: booking }, { origin: 'https://evil.example' }));
  assert.equal(cross.status, 403);
  assert.equal((await cross.json()).error, 'Please send this form from the Homescapes Studio website.');
  // A look-alike host is not the same host.
  assert.equal((await POST(req({ kind: 'booking', fields: booking }, { origin: 'https://www.homescapes.studio.evil.example' }))).status, 403);
  assert.equal((await POST(req({ kind: 'booking', fields: booking }, { origin: 'null' }))).status, 403);
  // The browser itself reports a cross-site request even if Origin were forged.
  assert.equal((await POST(req({ kind: 'booking', fields: booking }, { 'sec-fetch-site': 'cross-site' }))).status, 403);
  // Scripts that send no Origin at all (curl etc.) are refused.
  const noOrigin = new Request(URL_, { method: 'POST', body: JSON.stringify({ kind: 'booking', fields: booking }) });
  assert.equal((await POST(noOrigin)).status, 403);
  assert.equal(calls.length, 0);
});

test('origin check follows the deployment host (preview URL, localhost)', async () => {
  const preview = 'https://homescapes-website-git-homescripts-improvements-team.vercel.app';
  const previewReq = new Request(`${preview}/api/enquiry`, {
    method: 'POST',
    headers: { origin: preview, 'x-real-ip': '198.51.100.7' },
    body: JSON.stringify({ kind: 'contact', fields: { name: 'P', email: 'p@example.com' } })
  });
  assert.equal((await POST(previewReq)).status, 200);
  // Production origin posting to a preview deployment (or vice versa) is cross-origin.
  const mixed = new Request(`${preview}/api/enquiry`, {
    method: 'POST',
    headers: { origin: 'https://www.homescapes.studio', 'x-real-ip': '198.51.100.8' },
    body: JSON.stringify({ kind: 'contact', fields: { name: 'P', email: 'p@example.com' } })
  });
  assert.equal((await POST(mixed)).status, 403);
  const local = new Request('http://localhost:3000/api/enquiry', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'x-real-ip': '127.0.0.1' },
    body: JSON.stringify({ kind: 'contact', fields: { name: 'L', email: 'l@example.com' } })
  });
  assert.equal((await POST(local)).status, 200);
});

test('preview deployments label the email; production does not', async () => {
  process.env.VERCEL_ENV = 'preview';
  await POST(req({ kind: 'contact', fields: { name: 'Ravi', email: 'ravi@example.com' } }));
  assert.equal(sent().subject, '[Preview] New website enquiry: Ravi');
  assert.ok(sent().text.includes('via www.homescapes.studio'));
  process.env.VERCEL_ENV = 'production';
  stubResend();
  await POST(req({ kind: 'contact', fields: { name: 'Ravi', email: 'ravi@example.com' } }));
  assert.equal(sent().subject, 'New website enquiry: Ravi');
});

test('per-IP rate limit: 5 sends per 10 minutes, then 429 with Retry-After', async () => {
  const ip = { 'x-real-ip': '192.0.2.50' };
  for (let i = 0; i < 5; i++) {
    stubResend();
    const res = await POST(req({ kind: 'contact', fields: { name: `R${i}`, email: 'r@example.com' } }, ip));
    assert.equal(res.status, 200, `request ${i + 1} should pass`);
  }
  stubResend();
  const limited = await POST(req({ kind: 'contact', fields: { name: 'R6', email: 'r@example.com' } }, ip));
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  assert.match((await limited.json()).error, /wait a few minutes/);
  assert.equal(calls.length, 0);
  // Another visitor is unaffected.
  const other = await POST(req({ kind: 'contact', fields: { name: 'S', email: 's@example.com' } }, { 'x-real-ip': '192.0.2.51' }));
  assert.equal(other.status, 200);
  // Without x-real-ip, the first x-forwarded-for address is the key.
  const viaForwarded = (name: string) =>
    POST(new Request(URL_, {
      method: 'POST',
      headers: { origin: 'https://www.homescapes.studio', 'x-forwarded-for': '192.0.2.50, 10.0.0.1' },
      body: JSON.stringify({ kind: 'contact', fields: { name, email: 'r@example.com' } })
    }));
  assert.equal((await viaForwarded('R7')).status, 429);
});

test('invalid submissions and honeypot hits do not use up the rate limit', async () => {
  const ip = { 'x-real-ip': '192.0.2.60' };
  for (let i = 0; i < 8; i++) await POST(req({ kind: 'contact', fields: { name: 'A', email: 'bad' } }, ip));
  for (let i = 0; i < 8; i++) await POST(req({ kind: 'contact', fields: { name: 'A', email: 'a@b.co' }, hs_hp: 'x' }, ip));
  assert.equal((await POST(req({ kind: 'contact', fields: { name: 'A', email: 'a@b.co' } }, ip))).status, 200);
});

test('BotID verdict "bot" -> 403 and nothing sent', async () => {
  process.env.BOTID_DEV_BYPASS = 'BAD-BOT';
  const res = await POST(req({ kind: 'booking', fields: booking }));
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { ok: false, error: "We couldn't verify this request automatically." });
  assert.equal(calls.length, 0);
});

test('missing configuration -> 503 and nothing sent; Resend error -> 502; network error -> 502', async () => {
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(req({ kind: 'booking', fields: booking }))).status, 503);
  assert.equal(calls.length, 0);
  process.env.RESEND_API_KEY = 're_test';
  stubResend(422, { name: 'validation_error', message: 'bad from' });
  assert.equal((await POST(req({ kind: 'booking', fields: booking }))).status, 502);
  globalThis.fetch = (async () => { throw new TypeError('fetch failed'); }) as typeof fetch;
  assert.equal((await POST(req({ kind: 'booking', fields: booking }))).status, 502);
});

test('dry run sends nothing outside production, but is ignored in production', async () => {
  process.env.ENQUIRY_DRY_RUN = '1';
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(req({ kind: 'booking', fields: booking }))).status, 200);
  assert.equal(calls.length, 0);
  process.env.VERCEL_ENV = 'production';
  assert.equal((await POST(req({ kind: 'booking', fields: booking }))).status, 503);
});

test('only POST is exported (Vercel answers other methods with 405)', () => {
  assert.deepEqual(Object.keys(mod).sort(), ['POST', 'config']);
});

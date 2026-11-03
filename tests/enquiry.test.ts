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

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request(URL_, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://www.homescapes.studio', ...headers },
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

test('cross-origin browser POST -> 403; no Origin header is allowed', async () => {
  assert.equal((await POST(req({ kind: 'booking', fields: booking }, { origin: 'https://evil.example' }))).status, 403);
  const noOrigin = new Request(URL_, { method: 'POST', body: JSON.stringify({ kind: 'booking', fields: booking }) });
  assert.equal((await POST(noOrigin)).status, 200);
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

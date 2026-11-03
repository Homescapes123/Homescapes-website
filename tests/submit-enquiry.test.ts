// Unit tests for src/lib/enquiry.ts: the forms show success only when submitEnquiry resolves,
// so every failure path here must reject. Run: bun run test
import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { submitEnquiry, EnquiryError } from '../src/lib/enquiry.ts';

const GENERIC = "We couldn't send your request right now. Please try again in a moment.";
const realFetch = globalThis.fetch;

// Minimal stand-in for the <form> element: only the honeypot lookup is used.
const form = (honeypot = '') =>
  ({ elements: { namedItem: (name: string) => (name === 'hs_hp' ? { value: honeypot } : null) } }) as unknown as HTMLFormElement;

let lastBody: Record<string, unknown> | null = null;
function respond(status: number, body: string, contentType = 'application/json') {
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    lastBody = JSON.parse(init.body as string);
    return new Response(body, { status, headers: { 'content-type': contentType } });
  }) as typeof fetch;
}

const send = () => submitEnquiry('contact', { name: 'Asha', email: 'asha@example.com' }, form());

afterEach(() => {
  globalThis.fetch = realFetch;
  mock.timers.reset();
});

test('resolves only when the server confirms with { ok: true }', async () => {
  respond(200, JSON.stringify({ ok: true }));
  await send();
  assert.deepEqual(lastBody, { kind: 'contact', fields: { name: 'Asha', email: 'asha@example.com' }, hs_hp: '' });
});

test('sends the honeypot value so the server can discard bot submissions', async () => {
  respond(200, JSON.stringify({ ok: true }));
  await submitEnquiry('contact', { name: 'Bot' }, form('http://spam'));
  assert.equal(lastBody?.hs_hp, 'http://spam');
});

const failures: [string, () => void, string][] = [
  ['email provider failure (502)', () => respond(502, JSON.stringify({ ok: false, error: 'unavailable' })), GENERIC],
  ['email not configured (503)', () => respond(503, JSON.stringify({ ok: false, error: 'unavailable' })), GENERIC],
  ['function missing: SPA serves index.html with 200', () => respond(200, '<!doctype html><html></html>', 'text/html'), GENERIC],
  ['200 without ok flag', () => respond(200, JSON.stringify({})), GENERIC],
  ['200 with ok: false', () => respond(200, JSON.stringify({ ok: false })), GENERIC],
  ['200 with malformed JSON', () => respond(200, '{"ok": tru'), GENERIC],
  ['server error (500) with internal message', () => respond(500, JSON.stringify({ ok: false, error: 'stack trace' })), GENERIC],
  ['validation error (400)', () => respond(400, JSON.stringify({ ok: false, error: 'Please enter a valid email address.' })), 'Please enter a valid email address.'],
  ['rate limited (429)', () => respond(429, JSON.stringify({ ok: false, error: 'Please wait a few minutes.' })), 'Please wait a few minutes.'],
  ['bot check refused (403)', () => respond(403, JSON.stringify({ ok: false, error: "We couldn't verify this request automatically." })), "We couldn't verify this request automatically."],
  [
    'network failure',
    () => {
      globalThis.fetch = (async () => { throw new TypeError('Failed to fetch'); }) as typeof fetch;
    },
    GENERIC
  ]
];

for (const [name, setup, message] of failures) {
  test(`rejects on ${name}`, async () => {
    setup();
    await assert.rejects(send(), (err: unknown) => err instanceof EnquiryError && err.message === message);
  });
}

test('rejects if the request never completes (e.g. the bot-check script hangs)', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.fetch = (() => new Promise<Response>(() => {})) as typeof fetch;
  const pending = send();
  mock.timers.tick(25000);
  await assert.rejects(pending, (err: unknown) => err instanceof EnquiryError && err.message === GENERIC);
});

// Unit tests for src/lib/leadRecovery.ts against an in-memory localStorage. Run: bun run test
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  findRecoverableEnquiries,
  dismissRecoverableEnquiry,
  deliverRecoverableEnquiry
} from '../src/lib/leadRecovery.ts';

const LEGACY_KEY = 'homescapes_consultations_v2';
const DISMISSED_KEY = 'homescapes_recovery_dismissed';

class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.has(key) ? this.data.get(key)! : null; }
  setItem(key: string, value: string) { this.data.set(key, String(value)); }
  removeItem(key: string) { this.data.delete(key); }
}
let storage: MemoryStorage;
const realFetch = globalThis.fetch;

// Shapes exactly as the old BookingModal / ContactSection saved them.
const oldBooking = {
  name: 'Kavya Rao',
  email: 'kavya@example.com',
  phone: '+91 98765 43210',
  projectType: 'Residential Interiors',
  spaceType: 'Penthouse / Villa',
  estimatedBudget: '₹10,00,000 - ₹25,00,000',
  preferredDate: '2026-09-14',
  preferredTime: '10:00 AM IST',
  location: 'Gomti Nagar, Lucknow',
  notes: 'Three-bedroom villa',
  id: 'consult-1789200000000',
  status: 'Pending',
  createdAt: '2026-09-12T06:30:00.000Z'
};
const oldContact = {
  name: 'Ravi',
  email: 'ravi@example.com',
  phone: 'N/A',
  projectType: 'Commercial',
  estimatedBudget: '₹25,00,000+',
  preferredDate: '2026-10-01',
  preferredTime: '10:00 AM',
  spaceType: 'Entire Residence',
  location: 'Client Inquiry',
  notes: 'Office fit-out',
  id: 'consult-1790000000000',
  status: 'Pending',
  createdAt: '2026-10-01T09:00:00.000Z'
};
const save = (records: unknown) => storage.setItem(LEGACY_KEY, typeof records === 'string' ? records : JSON.stringify(records));
const savedIds = () => (JSON.parse(storage.getItem(LEGACY_KEY) ?? '[]') as { id: string }[]).map(r => r.id);

let posted: Record<string, unknown>[] = [];
function stubServer(status: number, body: unknown) {
  posted = [];
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    posted.push(JSON.parse(init.body as string));
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
}

beforeEach(() => {
  storage = new MemoryStorage();
  (globalThis as { localStorage?: unknown }).localStorage = storage;
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test('nothing to recover: no saved data, malformed JSON, or storage unavailable', () => {
  assert.deepEqual(findRecoverableEnquiries(), []);
  save('{not json');
  assert.deepEqual(findRecoverableEnquiries(), []);
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem() { throw new Error('SecurityError'); }
  };
  assert.deepEqual(findRecoverableEnquiries(), []);
});

test('ignores records the visitor did not create or that were handled', () => {
  save([
    { ...oldBooking, id: 'proj-1' },
    { ...oldBooking, id: 'consult-1', status: 'Confirmed' },
    { ...oldBooking, id: 'consult-2', email: 'not-an-email' },
    { ...oldBooking, id: 'consult-3', name: '  ' },
    { ...oldBooking, id: 'consult-4', createdAt: 'garbage' },
    'a string',
    null
  ]);
  assert.deepEqual(findRecoverableEnquiries(), []);
});

test('booking: keeps what the visitor chose, drops the hidden space type', () => {
  save([oldBooking]);
  const [e] = findRecoverableEnquiries();
  assert.equal(e.form, 'booking');
  assert.equal(e.submittedAt, '2026-09-12T06:30:00.000Z');
  assert.deepEqual(e.fields, {
    name: 'Kavya Rao',
    email: 'kavya@example.com',
    phone: '+91 98765 43210',
    projectType: 'Residential Interiors',
    budget: '₹10,00,000 - ₹25,00,000',
    message: 'Three-bedroom villa',
    location: 'Gomti Nagar, Lucknow',
    preferredDate: '2026-09-14',
    preferredTime: '10:00 AM IST'
  });
});

test("booking: the studio's own pre-filled address is not sent as the client's location", () => {
  save([{ ...oldBooking, location: 'Indira Nagar, Sugamau, Lucknow / Pan-India' }]);
  assert.equal(findRecoverableEnquiries()[0].fields.location, undefined);
});

test('contact form: invented date, time, location and "N/A" phone are dropped', () => {
  save([oldContact]);
  const [e] = findRecoverableEnquiries();
  assert.equal(e.form, 'contact');
  assert.deepEqual(e.fields, {
    name: 'Ravi',
    email: 'ravi@example.com',
    projectType: 'Commercial',
    budget: '₹25,00,000+',
    message: 'Office fit-out'
  });
});

test('newest first; dismissing hides one request but keeps every saved copy', () => {
  save([oldBooking, oldContact]);
  assert.deepEqual(findRecoverableEnquiries().map(e => e.id), [oldContact.id, oldBooking.id]);
  dismissRecoverableEnquiry(oldContact.id);
  dismissRecoverableEnquiry(oldContact.id);
  assert.deepEqual(findRecoverableEnquiries().map(e => e.id), [oldBooking.id]);
  assert.deepEqual(JSON.parse(storage.getItem(DISMISSED_KEY)!), [oldContact.id]);
  assert.deepEqual(savedIds(), [oldBooking.id, oldContact.id]);
});

test('delivery success removes only that saved request', async () => {
  save([oldBooking, oldContact]);
  stubServer(200, { ok: true });
  const [contact] = findRecoverableEnquiries();
  await deliverRecoverableEnquiry(contact);
  assert.equal(posted.length, 1);
  assert.deepEqual(posted[0], {
    kind: 'recovery',
    fields: { originalForm: 'Contact form', originalSubmittedAt: oldContact.createdAt, ...contact.fields },
    hs_hp: ''
  });
  assert.deepEqual(savedIds(), [oldBooking.id]);

  const [booking] = findRecoverableEnquiries();
  await deliverRecoverableEnquiry(booking);
  assert.equal((posted.at(-1)!.fields as Record<string, string>).originalForm, 'Consultation request');
  assert.equal(storage.getItem(LEGACY_KEY), null, 'key removed once nothing is left');
});

test('delivery failure keeps the saved request and reports the error', async () => {
  save([oldBooking]);
  const [e] = findRecoverableEnquiries();
  for (const [status, body] of [[502, { ok: false, error: 'unavailable' }], [503, { ok: false }], [200, {}]] as const) {
    stubServer(status, body);
    await assert.rejects(deliverRecoverableEnquiry(e));
    assert.deepEqual(savedIds(), [oldBooking.id]);
  }
  assert.equal(findRecoverableEnquiries().length, 1, 'still offered after a failure');
});

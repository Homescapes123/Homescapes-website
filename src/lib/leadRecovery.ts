// Until November 2026 the website "confirmed" consultation and contact requests but only saved them in
// the visitor's own browser (localStorage), so the studio never received them. When such a visitor
// returns, LeadRecoveryNotice offers to send their request now. Nothing is sent without their click,
// and a saved request is only removed once the studio has received it.

import { submitEnquiry } from './enquiry';

// Written by the old StudioContext; nothing writes it any more.
const LEGACY_KEY = 'homescapes_consultations_v2';
const DISMISSED_KEY = 'homescapes_recovery_dismissed';

// Values the old forms filled in themselves, which must not be passed off as the visitor's answers.
const OLD_CONTACT_FORM_LOCATION = 'Client Inquiry';
const OLD_BOOKING_PREFILLED_LOCATION = 'Indira Nagar, Sugamau, Lucknow / Pan-India';

export interface RecoverableEnquiry {
  id: string;
  form: 'booking' | 'contact';
  submittedAt: string;
  // Only what the visitor entered, keyed by the field names api/enquiry.ts expects for "recovery".
  fields: Record<string, string>;
}

export const RECOVERY_FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Project location',
  preferredDate: 'Preferred date',
  preferredTime: 'Preferred time',
  projectType: 'Project type',
  budget: 'Budget',
  message: 'Message'
};

function readJson(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {
    return null; // storage disabled or malformed data
  }
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

function toRecoverable(record: unknown): RecoverableEnquiry | null {
  if (typeof record !== 'object' || record === null) return null;
  const r = record as Record<string, unknown>;
  const id = text(r.id);
  const submittedAt = text(r.createdAt);
  // Only requests this browser created through the old forms and that nobody marked as handled.
  if (!/^consult-\d+$/.test(id) || r.status !== 'Pending' || Number.isNaN(Date.parse(submittedAt))) return null;
  if (!text(r.name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(r.email))) return null;

  const form = text(r.location) === OLD_CONTACT_FORM_LOCATION ? 'contact' : 'booking';
  const candidate: Record<string, string> = {
    name: text(r.name),
    email: text(r.email),
    phone: text(r.phone) === 'N/A' ? '' : text(r.phone),
    projectType: text(r.projectType),
    budget: text(r.estimatedBudget),
    message: text(r.notes)
  };
  // The old contact form invented a date, time and location; the booking form's were real choices,
  // except a location left at the studio's own pre-filled address.
  if (form === 'booking') {
    candidate.location = text(r.location) === OLD_BOOKING_PREFILLED_LOCATION ? '' : text(r.location);
    candidate.preferredDate = text(r.preferredDate);
    candidate.preferredTime = text(r.preferredTime);
  }
  const fields = Object.fromEntries(Object.entries(candidate).filter(([, value]) => value !== ''));
  return { id, form, submittedAt, fields };
}

const dismissedIds = () => {
  const saved = readJson(DISMISSED_KEY);
  return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
};

// Newest first; excludes requests the visitor already declined.
export function findRecoverableEnquiries(): RecoverableEnquiry[] {
  const saved = readJson(LEGACY_KEY);
  if (!Array.isArray(saved)) return [];
  const dismissed = new Set(dismissedIds());
  return saved
    .map(toRecoverable)
    .filter((e): e is RecoverableEnquiry => e !== null && !dismissed.has(e.id))
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
}

// "No thanks": never offer this request again, but leave the visitor's saved copy alone.
export function dismissRecoverableEnquiry(id: string) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...new Set([...dismissedIds(), id])]));
  } catch {
    // storage unavailable: the notice may simply reappear on a later visit
  }
}

function removeDeliveredRecord(id: string) {
  try {
    const saved = readJson(LEGACY_KEY);
    if (!Array.isArray(saved)) return;
    const remaining = saved.filter(record => !(typeof record === 'object' && record !== null && (record as { id?: unknown }).id === id));
    if (remaining.length > 0) localStorage.setItem(LEGACY_KEY, JSON.stringify(remaining));
    else localStorage.removeItem(LEGACY_KEY);
  } catch {
    // storage unavailable: nothing to clean up
  }
}

// Sends the request to the studio; the saved copy is removed only after the server confirms delivery.
export async function deliverRecoverableEnquiry(enquiry: RecoverableEnquiry): Promise<void> {
  await submitEnquiry('recovery', {
    originalForm: enquiry.form === 'booking' ? 'Consultation request' : 'Contact form',
    originalSubmittedAt: enquiry.submittedAt,
    ...enquiry.fields
  });
  removeDeliveredRecord(enquiry.id);
}

// Sends a form submission to /api/enquiry (api/enquiry.ts), which emails it to the studio.

export type EnquiryKind = 'booking' | 'contact' | 'review';

// Name of the hidden anti-spam field rendered by <HoneypotField />.
export const HONEYPOT_FIELD = 'hs_hp';

const GENERIC_ERROR = "We couldn't send your request right now.";

export class EnquiryError extends Error {}

export async function submitEnquiry(
  kind: EnquiryKind,
  fields: Record<string, string | number>,
  form: HTMLFormElement
): Promise<void> {
  const honeypot = (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? '';

  let response: Response;
  try {
    response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, fields, [HONEYPOT_FIELD]: honeypot }),
      // Lets the request finish even if the visitor closes the tab right after submitting.
      keepalive: true
    });
  } catch {
    throw new EnquiryError(GENERIC_ERROR);
  }

  // If the function isn't deployed, the SPA rewrite answers with index.html, so insist on JSON.
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body: { ok?: boolean; error?: string } | null = isJson ? await response.json().catch(() => null) : null;
  if (response.ok && body?.ok) return;

  // 400s carry a message written for the visitor (e.g. invalid email); anything else is our fault.
  throw new EnquiryError(response.status === 400 && body?.error ? body.error : GENERIC_ERROR);
}

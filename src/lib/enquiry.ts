// Sends a form submission to /api/enquiry (api/enquiry.ts), which emails it to the studio.
// Resolves only when the server confirms the email was sent; every other outcome throws.

export type EnquiryKind = 'booking' | 'contact' | 'review';

// Name of the hidden anti-spam field rendered by <HoneypotField />.
export const HONEYPOT_FIELD = 'hs_hp';

const GENERIC_ERROR = "We couldn't send your request right now. Please try again in a moment.";
const TIMEOUT_MS = 25000;

// Statuses whose error message is written for the visitor (validation, refused, rate limited).
const VISITOR_MESSAGE_STATUSES = new Set([400, 403, 429]);

export class EnquiryError extends Error {}

export async function submitEnquiry(
  kind: EnquiryKind,
  fields: Record<string, string | number>,
  form: HTMLFormElement
): Promise<void> {
  const honeypot = (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? '';

  // BotID (src/main.tsx) wraps fetch and may wait on its challenge script, so time out the whole call.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new EnquiryError(GENERIC_ERROR)), TIMEOUT_MS);
  });

  let response: Response;
  try {
    response = await Promise.race([
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, fields, [HONEYPOT_FIELD]: honeypot }),
        // Lets the request finish even if the visitor closes the tab right after submitting.
        keepalive: true
      }),
      timeout
    ]);
  } catch {
    throw new EnquiryError(GENERIC_ERROR);
  } finally {
    clearTimeout(timer);
  }

  // If the function isn't deployed, the SPA rewrite answers with index.html, so insist on JSON.
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body: { ok?: boolean; error?: string } | null = isJson ? await response.json().catch(() => null) : null;
  if (response.ok && body?.ok === true) return;

  throw new EnquiryError(VISITOR_MESSAGE_STATUSES.has(response.status) && body?.error ? body.error : GENERIC_ERROR);
}

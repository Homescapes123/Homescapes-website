# Deployment notes

The site is a static Vite build plus one Vercel Function, `api/enquiry.ts`, which emails form
submissions to the studio through Resend. Nothing about visitors or enquiries is stored by the site.

Production (`main` → www.homescapes.studio) changes only with the owner's explicit approval.
Other branches get Vercel preview deployments.

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Production | Preview | Notes |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | required | required to test email | Resend API key with "Sending access". Server-only. |
| `ENQUIRY_FROM_EMAIL` | required | required to test email | e.g. `Homescapes Website <enquiries@homescapes.studio>`; the domain must be verified in Resend. |
| `ENQUIRY_TO_EMAIL` | optional | recommended | Defaults to `workwithhomescapes@gmail.com`. Scope a test inbox to Preview so test enquiries don't reach the studio. Preview emails are also prefixed `[Preview]`. |

Never prefix these with `VITE_` (that would publish them in the browser bundle).
`ENQUIRY_DRY_RUN` and `BOTID_DEV_BYPASS` are for local development only; don't set them on Vercel
(dry run is ignored in production anyway).

Without `RESEND_API_KEY` / `ENQUIRY_FROM_EMAIL`, the forms show an error with the WhatsApp,
phone and email fallbacks; they never claim success.

## Resend

1. Create the account with the business Gmail.
2. Domains → Add `homescapes.studio`, then add the DNS records Resend lists at the domain's DNS
   provider. Wait until Resend shows the domain as verified.
3. API Keys → create a key with sending access, restricted to that domain, and store it in Vercel.

Free plan (checked 2026-11-04): 3,000 emails/month, 100/day. Review Resend's terms for commercial use.

## Abuse protection

Built in (`api/enquiry.ts`):

- Only same-origin browser requests (Origin must match the deployment's own host; `Sec-Fetch-Site`
  must be `same-origin` when present). This holds for production, every preview URL and localhost
  without configuration. A production page cannot post to a preview deployment, or vice versa.
- 16 KB body limit, field validation, hidden honeypot field.
- Per-IP limit of 5 sent enquiries per 10 minutes, per function instance.
- Vercel BotID (invisible challenge), wired up in `src/main.tsx` and checked on the server.

To configure in the Vercel dashboard:

1. **Firewall rate-limit rule** (shared across all instances; available on all plans).
   Firewall → Configure → New Rule:
   - If *Request Path* equals `/api/enquiry` and *Method* equals `POST`
   - Then *Rate Limit*, Fixed Window, 600 s window, 10 requests, key *IP*, action *Default (429)*
   - Save, then Review Changes → Publish.
2. **BotID**. Basic checks are free and need no setup. On Pro, *Vercel BotID Deep Analysis*
   (Firewall → Rules) adds stronger detection at $1 per 1,000 checks (one check per submission).
   BotID needs the project's OIDC token; if the function logs
   `The 'x-vercel-oidc-token' header is missing`, enable OIDC Federation in the project's security
   settings. If the BotID check errors, enquiries are still delivered (and logged) rather than lost.

## Testing on a preview deployment

1. Push the branch; open the preview URL from Vercel.
2. Submit each form (consultation, contact, review) from the site. Expected: success screen and an
   email with a `[Preview]` subject at the Preview `ENQUIRY_TO_EMAIL` inbox.
3. Confirm `curl -X POST <preview>/api/enquiry` without an Origin header returns 403, and that a
   non-browser request with a forged Origin is refused by BotID (403). If Vercel Authentication
   protects previews, curl gets 401 before reaching the function; use a protection-bypass token.
4. Temporarily remove the Resend key from Preview to confirm the forms show the error, never success.

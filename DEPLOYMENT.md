# Production rollout

The SEO routes, Google verification file and package security updates can run independently of the authentication rollout.

## Required before merging the authentication change

Configure these as sensitive environment variables in the Vercel project serving `www.aslicelikpilates.com`, for Production and any trusted Preview environment being tested:

- `AUTH_SECRET`: at least 32 random bytes; generate with `openssl rand -hex 48`.
- `ADMIN_USERNAME`: the initial administrator username.
- `ADMIN_PASSWORD_HASH`: a scrypt hash generated with `node scripts/create-password-hash.mjs`. Supply a unique password of 14–256 characters on stdin, never as a command argument or Git commit. Do not paste secrets into a PR or chat.
- Keep the existing `DATABASE_URL` and SMTP variables. Required TLS database connections now validate certificates. Test the database connection in a trusted preview before production.

Legacy plaintext passwords and the old default account are intentionally rejected. A hashed database administrator takes precedence over bootstrap environment credentials. Once signed in using bootstrap credentials, change the username/password in the panel to persist a fresh hash. Password changes revoke older sessions.

The live database schema must already exist. Production HTTP requests no longer create schema or insert demonstration records. Apply schema changes deliberately using the operator's database deployment workflow. The shared `acp_rate_limits` table is currently created lazily on the first rate-limited request and needs CREATE TABLE permission. Move that step to a migration before restricting the application database role further.

## Validation

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test:security`
- `npm audit` (all dependency groups)
- `npm run build`
- Start the production build locally on port 3107 and run `node scripts/smoke.mjs`.

The unit tests stub database records. The HTTP tests are restricted to localhost, verify unauthenticated denial, server-rendered login privacy, SEO pages, sitemap and the canonical-host redirect. They do not modify a live database or send email. An authenticated database-backed login, password change, public lead submission and admin CRUD flow still need a trusted preview with actual environment configuration before merging.

## Intentional behavior changes

- Only authenticated administrators can access management APIs. Instructor access by selecting a name is disabled pending separate credentials and server-enforced instructor permissions.
- Public member applications create pending leads in the inquiries tab. They never grant memberships, paid status or session entitlements. An administrator reviews applications and creates the membership.
- The test-email endpoint is disabled.
- Blanket reminder emails are disabled, including the dashboard button, until member-specific scheduling and persistent deduplication are implemented. The existing cron returns 503 after authentication; it sends no email. Remove/disable that scheduled job in the hosting dashboard if repeated failed scheduled requests are undesirable.
- Logout clears the HttpOnly cookie; changing the administrator password invalidates all older tokens. Session lifetime is eight hours.
- Browser form submissions in production require the canonical www origin. Non-www requests redirect permanently to www.

## Search visibility

Google ownership file: `/google9310f2f085da4886.html`. Preserve it after verification. The provided Google Maps listing is linked from contact information and the studio schema. Coordinates were taken from that listing's place coordinates, not the earlier estimated coordinates.

Submit `https://www.aslicelikpilates.com/sitemap.xml` in the owner's Search Console after deployment and ownership verification. Search Console account actions and Business Profile changes are outside this code rollout. Useful local content, consistent business information and indexable pages support both search and AI discovery; no position or recommendation is guaranteed.

# Go Mail by GoGentik

A responsive Next.js marketing website and interactive product concept for an intelligent business email layer. Built with App Router, React, TypeScript, Tailwind CSS, Motion, and Lucide.

## Run Locally

Use Node.js 22.6+ and npm. Font files are downloaded by Next.js at build time and self-hosted afterward.

```sh
npm install
npm run dev
```

Open http://localhost:3000. To choose a port explicitly in Windows PowerShell:

```sh
node node_modules/next/dist/bin/next dev --port 3002
```

```sh
npm test
npm run lint
npm run build
npm start
```

## Product Experience

- Four selectable, expandable organizations with realistic conversations.
- Search, starred conversations, local sent messages, drafts, and empty states.
- Separate suspicious-email category with an illustrative domain-impersonation warning.
- Local reply composer, read receipts, typing animation, and attachment preview.
- A dedicated mobile inbox-to-conversation flow instead of a scaled desktop UI.
- Interactive security comparison, deployment diagrams, and all marketing sections.
- Accessible native dialogs, field validation, keyboard dismissal, focus restoration, and reduced-motion support.

The demo does not access mailboxes, verify actual senders, send emails, or persist messages. Names, organizations, conversations, read receipts, and threat signals are illustrative. Provider marks identify planned compatibility, not partnerships or endorsements.

## Early-Access Integration

Set `SITE_URL` to the public HTTPS origin before the production build so Open Graph and social-image URLs resolve to your domain. The local fallback is `http://localhost:3000`.

Without configuration, the form validates entirely in the browser. It explicitly states that nothing was sent or stored and offers a locally generated request download. No fake success message is shown. `/api/early-access` returns `503` when collection is not configured.

The server endpoint can forward validated requests to an HTTPS webhook. Configure the following server-side environment variables, using `.env.example` as a reference:

- `EARLY_ACCESS_WEBHOOK_URL`: Your request service's HTTPS endpoint.
- `EARLY_ACCESS_WEBHOOK_TOKEN`: Optional bearer token, kept on the server.

Set variables before building and rebuild after changing availability: the landing page is statically rendered and uses the configuration to describe the submission mode. The webhook must return a successful HTTP status only after accepting the request. The site does not maintain its own database or send confirmation emails.

Payload fields: `name`, `email`, `company`, `employees`, `provider`, `message`, `intent`, `source`, and `requestedAt`. The endpoint checks field lengths, enumerated options, content type, request origin, and malformed JSON. It has an outbound timeout and does not log submitted personal information.

Before enabling public collection, configure deployment-level rate limits and bot protection, verify webhook retention/access controls, and publish reviewed privacy and service terms identifying the legal operator, processors, retention policy, and contact details. Current legal dialogs are transparent preview notices, not final commercial agreements. The product sign-in is intentionally an availability dialog, not a mock authentication system.

## Project Structure

- `src/components/home.tsx`: Marketing sections and section illustrations.
- `src/components/inbox-demo.tsx`: Interactive inbox and conversation state.
- `src/components/request-dialog.tsx`: Request forms and information dialogs.
- `src/components/brand.tsx`: Brand and provider marks.
- `src/lib/early-access.ts`: Shared client/server request validation.
- `src/app/api/early-access/route.ts`: Optional server-side request delivery.
- `src/app/globals.css`: Responsive visual system and motion preferences.
- `src/app/opengraph-image.tsx`: Generated social-sharing image.
- `tests/early-access.test.mjs`: Validation regression tests using Node's test runner.

## Verification

Production build, TypeScript, ESLint, and form-validation tests are available through the commands above. Browser checks cover organization switching, suspicious-sender isolation, local replies, attachment preview, mobile navigation, form errors, truthful preview completion, and dialog focus restoration. An axe-core scan was run against the marketing page and form; automated accessibility checks do not replace manual assistive-technology testing.

## Assets

Small portrait images are served locally through `next/image`. They represent fictional demo participants, not employees, customers, or endorsements. Original images are from Unsplash:

- `photo-1500648767791-00dcc994a43e`
- `photo-1580489944761-15a19d654956`
- `photo-1472099645785-5658abf4ff4e`

DM Sans and Manrope are loaded through `next/font`. Provider names and marks belong to their respective owners. No analytics, advertising trackers, adoption statistics, testimonials, or security certifications have been added.

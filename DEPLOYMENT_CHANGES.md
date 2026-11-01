# CodeMyWay (codemyway.tech) – Changes needed before going live

Status today: the **frontend is a prototype** (all data is hard-coded, no login, no real forms, simulated payment).
The **backend is a working but unfinished/unsafe starter** (copied from "CodeDojo"). They are connected only by the dev proxy; the UI does not call the API yet.

Priority: **P0** = must fix before the site is public · **P1** = needed for a real business launch · **P2** = polish.

---

## 1. Frontend (`frontend/`)

### 1.1 Remove simulation / prototype / demo (P0)

| What | Where | Action |
|---|---|---|
| "Prototype Checkout · Simulation Mode", "Simulate Payment Method", "Confirm Enrollment (Simulated)", "Prototype Enrollment Confirmed" (your screenshot) | `components/common/Modals.tsx` ~L305-445 (`BuyNowCheckoutModal`) | Replace with a real checkout (payment gateway, see 3.3). Until payments exist: change CTA to "Apply / Talk to admissions" and capture a lead instead |
| "Prototype Notice" boxes | `Modals.tsx` L104-108 (brochure), `StudentDashboardPage.tsx` L1488 | Delete |
| "Prototype Environment" in footer, "Student Dashboard (Demo Learner)" | `Footer.tsx` L127, L153 | Delete / rename |
| "Demo Student Portal" button, "Student Dashboard (Demo)" | `Header.tsx` L81, L139 | Replace with **Login** / **My Dashboard** (shown only when logged in) |
| Demo banner, **"Instructor Simulation Mode"** toggle, **"Admin Simulator"** badge-threshold modal | `StudentDashboardPage.tsx` L76, L254, L285, L1502-1515 | Delete. Students must never see instructor/admin controls |
| `DEMO_STUDENT`, `DEMO_PHASES`, `DEMO_ASSIGNMENTS`, `DEMO_BOOKINGS`, … and fake Meet links `meet.google.com/demo-cmw-*` | `data/mockData.ts`, `StudentDashboardPage.tsx` L191, L403 | Remove; load from API (1.3) |
| `metadata.json`, "Interactive prototype of…" description | `frontend/metadata.json`, `index.html` meta/og tags | Delete the JSON (AI Studio leftover); rewrite meta text as real marketing copy |
| "Curriculum preview video placeholder" | `HomePage.tsx` L182 | Real video (YouTube/Vimeo embed) or remove section |

### 1.2 Forms currently throw data away (P0)

The brochure, talk-to-mentor, notify-me and discount popup forms only flip a local `step`/`isSubmitted` flag (`Modals.tsx` L17-21, L173, L474; `DiscountPopupModal.tsx` L62-69). **No lead is ever sent anywhere.** You would launch and collect zero enquiries.
- Add a backend `POST /api/leads` (see 2.4) and call it from all four forms via `src/api.ts`.
- Add validation (email/phone format), a spam honeypot or CAPTCHA (Cloudflare Turnstile), and a consent checkbox.
- The brochure itself must be a real PDF link. (The "SMS OTP / prototype" note was removed; mobile OTP is not a feature.)

### 1.3 Login, dashboard, courses (P0/P1)

- **No login or register screen exists.** `App.tsx` routes by `window.location.pathname` only; `/student/dashboard` is open to anyone and shows the demo learner.
- Build: Login, Register, Forgot password pages → `api('/auth/login')`, `/auth/register`, `/auth/me`, `/auth/logout`. Keep auth in an `AuthContext`; redirect to login when `/auth/me` returns 401.
- Student Dashboard: replace every `DEMO_*` state with data from `/api/student/dashboard`, `/curriculum`, `/attendance`, `/leaderboard`, `/notifications`, `/mentor`, `/tickets`, `/certificates`, `/submit-answer`. **Check the response shapes first**: the UI types (`types/index.ts`: phases/assignments/projects/badges) do not match the backend's Prisma model (modules/classes/questions). Expect a mapping layer or UI rework – this is the largest task.
- Courses: Home, Course Details and Skill Store read `PROGRAM_INFO`, `MICRO_COURSES`, `FAQS` from `mockData.ts`. Switch to `/api/public/courses` so you can edit courses from admin without redeploying. Add a `/courses/:slug` route instead of the hard-coded `data-analyst-genai`.
- Admin / instructor / mentor screens do not exist in this frontend (they were in the CodeDojo Next.js pages that I left out). Decide: rebuild them, or manage via a separate admin tool. Without them, you can't add courses/classes/attendance except by calling the API manually.

### 1.4 Pricing and marketing claims (P0 – legal/reputation)

- **Inconsistent prices**: `mockData.ts` L21-22 says ₹29,999 / ₹24,999; most pages say ₹36,000 / ₹24,999; the popup says ₹35,999 (`DiscountPopupModal.tsx` L129). Make **one** source (the course record from the API) and render it everywhere. "30% off" on ₹36,000 → ₹25,200, not ₹24,999; check the maths.
- **Registration fee "To be confirmed"** (screenshot) – publish the real amount, or customers won't trust it.
- **Fake urgency**: the popup has a countdown timer that resets on every load (`DiscountPopupModal.tsx` L42-54) and App.tsx reads `hasSeenPopup` but never uses it (L44), so it reappears on **every page load**. The code `BATCH30` is client-side only and checked nowhere. Use a real cohort start date/seat count and real coupon validation, or remove. (Misleading urgency/discounts can violate India's Consumer Protection rules and ASCI guidelines.)
- **Salary figures** "₹5.5L – ₹11.0L PA" etc. (`HomePage.tsx` L604-634) and the **competitor comparison table** with figures like "Often ₹80,000 to ₹1.5L with high NBFC loan interest" (L723-726): you need a verifiable source or remove them. Have them reviewed before publishing.
- Fix typo-level content: "Enrolled Price" (screenshot) → "Enrolment price"; verify all claims (24 weeks, 4 teachers, free mock interviews, monthly masterclasses) match what you can deliver.

### 1.5 Routing and app structure (P1)

- Custom pathname switch with `pushState`, **no `popstate` handler** → browser Back/Forward changes the URL but not the page. Replace with `react-router-dom` (routes: `/`, `/courses/:slug`, `/skill-store`, `/login`, `/register`, `/dashboard`, `*` → 404).
- Static hosting must **rewrite all paths to `index.html`**, otherwise refreshing `/skill-store` is a 404 (see 3.2).
- `App.tsx` is a single component holding all modals' state; fine for now, split when adding auth.

### 1.6 Required website pages, SEO, tracking (P1)

- Footer "Fee Transparency Notice", "Academic Code of Ethics" are plain text, not links. Add real pages: **Privacy Policy, Terms, Refund & Cancellation Policy** (payment gateways require these), Contact (real email/phone/address, company registration details).
- Add social links, WhatsApp/contact CTA.
- `index.html`: set `<link rel="canonical" href="https://codemyway.tech/">`, add `og:image` (1200×630), `og:url`, favicon, `robots.txt`, `sitemap.xml`; `lang`/title cleanup. Because it's a client-rendered SPA, consider pre-rendering (e.g. `vite-plugin-ssg`/prerender) or moving marketing pages to Next.js if SEO matters.
- Analytics (GA4/Plausible) + cookie consent if you serve EU users; Meta Pixel if you run ads.
- Images: 4 JPGs ≈ 3 MB total (`src/assets/images`) → convert to WebP/AVIF, ≤150 KB each, add `width/height`, `loading="lazy"`.
- Accessibility pass (modals need focus trap + `role="dialog"`, button labels).

### 1.7 Cleanup (P2)

- `package.json`: name is `react-example`; remove unused `express`, `dotenv`, `@google/genai`, `@types/express`, `esbuild`, and the `clean` script that deletes `server.js` (AI Studio leftovers). `typescript ^7.0.2` is unusual – pin to a stable version.
- `vite.config.ts`: AI Studio `DISABLE_HMR` comments/logic, `alias '@'`; remove what you don't use. Set `build.sourcemap: false` (default) for production.
- `.env.example`: now only `VITE_API_PROXY_TARGET` (dev only). In production the browser calls relative `/api`, no env needed.
- Never put secrets in the frontend (`VITE_*` vars are public).

---

## 2. Backend (`backend/`)

### 2.1 Security – must fix before public (P0)

| # | Problem | Where | Fix |
|---|---|---|---|
| 1 | **`/api/admin/courses` has no authentication at all.** Anyone on the internet can list, create, overwrite or **delete** course modules/lessons/features (`PUT` calls `deleteMany`). | `src/app/api/admin/courses/route.ts` (GET/POST/PUT) | Add `getSessionUser()` + `role === 'ADMIN'` check like the other admin routes. Also check for `DELETE`/other handlers you add later. Best: one shared `requireRole()` helper used by every route |
| 2 | Passwords hashed with **unsalted SHA-256** | `lib/auth.ts` L10-12 | Use `bcrypt`/`argon2`; rehash legacy hashes on successful login; add min length/complexity |
| 3 | **Hard-coded fallback JWT secret** (`codedojo_super_secret_key…`) is in the code, and in docker-compose of the original repo. If `JWT_SECRET` is missing, anyone can forge an ADMIN token | `lib/auth.ts` L6-8 | Throw at startup if `JWT_SECRET` is unset; generate a 64-byte random value; **never reuse the dev value** |
| 4 | **Social login logs anyone in as `aarav@codedojo.com`** with no verification | `auth/login/route.ts` L69-90 | Delete, or implement real Google OAuth (verify the ID token server-side) |
| 5 | ~~Mobile "OTP" accepted any 6-digit code~~ | `auth/login/route.ts` | **Done: mobile OTP login removed.** Fake social login also removed; real Google sign-in added (needs `GOOGLE_CLIENT_ID`) |
| 6 | Seed script creates an **ADMIN with password `password123`**, and wipes the whole database first | `prisma/seed.ts` L41+ | Never run the seed against production. Create the first admin with a one-off script using a strong password, then remove the seed or guard it (`if NODE_ENV==='production' exit`) |
| 7 | Database password and JWT secret exist in `backend/.env`, and passwords were pasted in chat | `.env` | **Rotate the Supabase DB password**, keep secrets in the host's env-var settings, never commit `.env` (already git-ignored) |
| 8 | ~~Internal errors returned to clients; fake trace log in AI response~~ | all routes | **Done:** routes return a generic message and log the real error server-side; AI route no longer returns `logs`, and Gemini failures no longer leak details or fall back to made-up stats in production |
| 9 | No rate limiting on login, register, AI agent (each AI call costs money) | – | Add rate limits (Upstash Ratelimit / Cloudflare rules), lockout on repeated failed logins, cap AI usage per student per day |
| 10 | **Supabase exposes tables through its public REST API** by default | Supabase project | Turn on Row Level Security for every table (no policies = deny anon). Prisma uses the DB owner connection, so the app keeps working |

### 2.2 Input validation and correctness (P1)

- No schema validation of request bodies; add `zod` for every POST/PUT (email format, password rules, enums, lengths). Example: register accepts any `courseId` and unpublished courses.
- Login `await req.json()` on invalid JSON returns 500; return 400.
- Registration enrols the user and attaches the first mentor found; replace with real enrolment after payment.
- No email verification, no forgot/reset password, no logout-everywhere/token revocation (JWT is stateless, 24 h). Add reset flow with email (Resend/SES/Brevo).
- Origin/CSRF check on state-changing requests (cookie is `sameSite: lax`, which covers most cases; add an `Origin` header check anyway).
- Add database indexes for frequent filters (e.g. `Attendance.studentId`, `Class.batchId`, `Notification.userId`) and pagination on list endpoints.

### 2.3 Remove CodeDojo leftovers and fake numbers (P0/P1)

- Branding strings: "Welcome to CODEDOJO" (`auth/register/route.ts` L57), system prompt "CODEDOJO Learning Assistant… Supabase PostgreSQL" (`ai-agent/route.ts` L142), emails `@codedojo.com`, BigQuery dataset `codedojo_analytics`, JWT secret name. Rename to CodeMyWay.
- **Fabricated analytics**: `lib/bigquery.ts` returns hard-coded `average_grade: 88.4`, `total_courses: 10`, `total_students: 20` when BigQuery is missing or fails, and its comments/log lines still say "SQLite" although you use Postgres. If admin stats show these, you will report fake numbers. Compute from the database or remove; drop `@google-cloud/bigquery` if you don't use it.
- Seed data (`prisma/seed.ts`): Marvel/Avengers content, demo students; replace with your real courses (Data Analyst + GenAI, micro-courses) or load them through admin.
- `ai-agent` uses keyword matching (`includes('ticket')`) to decide to **create a support ticket**; "can you create a plan" would raise a ticket. Tighten, or confirm with the user first.
- Gemini helper silently falls back to canned "simulation" answers when the key is missing/`mock-key-for-local-testing` (`lib/gemini.ts`). In production, fail loudly instead of faking AI replies.

### 2.4 Missing backend features for a real business (P1)

- **Leads**: `Lead` model + `POST /api/leads` (name, email, phone, source: brochure/mentor/notify/discount, consent) + admin list/export + email notification to sales.
- **Payments**: Razorpay (INR, UPI/cards/netbanking). Needs `Order`/`Payment` models, `POST /api/payments/create-order`, **signature-verified webhook** (`/api/payments/webhook`) that creates the enrolment, invoices/GST receipts, refunds. Never trust the browser's "payment success".
- **Coupons**: `Coupon` model with validity, usage limits (replaces client-side `BATCH30`).
- **Email**: transactional email (welcome, receipt, OTP, reset).
- **Admin**: audit log of admin changes, ability to create the first admin safely.
- **File storage** if you want assignment uploads/certificates (S3/Supabase Storage); currently only URLs are stored.

### 2.5 Prisma / database / config (P1)

- `schema.prisma` has only `url = env("DATABASE_URL")`. On Supabase, use the **transaction pooler (port 6543, `?pgbouncer=true&connection_limit=1`) for the running app** and a **direct/session connection for migrations**: add `directUrl = env("DIRECT_URL")` to the datasource and set both env vars.
- Prisma is pinned at 6.3.0; plan an upgrade. Deploy migrations with `prisma migrate deploy` (never `migrate dev`/`db push`) in your release step.
- `next.config.ts`: add security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`), `poweredByHeader: false`.
- Add `GET /api/health` (DB ping) for uptime monitoring; structured logging (pino) and error tracking (Sentry on both apps).
- Automated Supabase backups (paid plan) or scheduled `pg_dump`.
- I dropped the original `Dockerfile` and GitHub deploy workflow. Add a new Dockerfile only if you deploy with containers.
- No tests. At minimum, write API tests for auth and role guards (the missing check in 2.1 #1 would have been caught).

---

## 3. Deploying to codemyway.tech

### 3.1 Recommended architecture (keeps dev behaviour, no CORS)

```
https://codemyway.tech           → frontend static build (frontend/dist)
https://codemyway.tech/api/*     → backend (Next.js, port 4000)
```
Same origin means the `token` cookie works without CORS or cookie-domain tricks, exactly like the dev proxy.

Two ways to do it:
- **A. One VPS (simplest, cheap)**: Nginx/Caddy serves `frontend/dist`, proxies `/api` to `next start -p 4000` under pm2/systemd; Let's Encrypt HTTPS. Add `try_files $uri /index.html;` for SPA routes.
- **B. Managed**: frontend on Vercel/Netlify/Cloudflare Pages, backend as a separate Vercel project (Next.js). Add a rewrite in the frontend host: `/api/(.*)` → `https://<backend-project>.vercel.app/api/$1`. (If instead you use `api.codemyway.tech`, set the cookie `domain: '.codemyway.tech'` and enable CORS with `credentials: true` for `https://codemyway.tech` only.)

### 3.2 DNS / TLS

- Point the apex `codemyway.tech` (A/ALIAS) and `www` (CNAME) to the host; redirect `www` → apex (or the reverse) with a 301; force HTTPS.
- SPA fallback rule on the host (`/*` → `/index.html`, status 200).
- Email: add SPF, DKIM, DMARC records for your sending provider.

### 3.3 Production environment variables

Backend:
```
DATABASE_URL   = Supabase transaction-pooler URL (6543, pgbouncer=true)
DIRECT_URL     = Supabase session/direct URL (migrations only)
JWT_SECRET     = <64+ random bytes>
GEMINI_API_KEY = <real key, if using the AI assistant>
NODE_ENV       = production
RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_WEBHOOK_SECRET   (when payments are added)
EMAIL_API_KEY, SITE_URL=https://codemyway.tech
```
Frontend: none required (uses relative `/api`).

### 3.4 Build and release

```
npm ci --prefix backend && npm run build --prefix backend      # prisma generate + next build
npx prisma migrate deploy --prefix backend                      # schema only, no seed
npm ci --prefix frontend && npm run build --prefix frontend     # → frontend/dist
npm run start --prefix backend                                  # port 4000
```
Use Node 22 LTS everywhere (including CI).

---

## 4. Suggested order of work

1. **Security (2.1 #1–#8)**: guard `admin/courses`, real JWT secret, remove fake social/OTP login, bcrypt, hide errors, rotate DB password, enable RLS. *(≈ 1 day)*
2. **Remove prototype/simulation text and demo dashboard access (1.1)**; fix pricing/claims (1.4). *(≈ 1 day)*
3. **Leads API + wire the 4 forms (1.2, 2.4)**, privacy/terms/refund pages, contact details. *(≈ 1–2 days)* → this alone lets you launch a marketing site that captures enquiries.
4. **Auth UI + connect courses to the API (1.3)**, router (1.5). *(≈ 3–5 days)*
5. **Student dashboard on real data** and admin tooling. *(≈ 1–2 weeks)*
6. **Payments + coupons + email (2.4)** → then the real checkout replaces the simulated one. *(≈ 1 week)*
7. Deploy (section 3), monitoring, backups, SEO/analytics.

> A reasonable first public release is steps 1–3 (a real marketing site with lead capture) while 4–6 are built. Do not expose the dashboard or checkout until they are real.

---

*Scope note: this review covered all backend routes' auth/role checks, auth, login/register, courses, AI, BigQuery, seed and config files, and the frontend's modals, header/footer, mock data, routing, forms and pricing. The 80 KB `StudentDashboardPage.tsx` and `HomePage.tsx` were scanned for simulation/claims and handlers rather than read line by line, and I did not test the app in a browser beyond confirming it loads. Legal items (consumer-protection, refund policy, salary/comparison claims) need review by someone qualified.*

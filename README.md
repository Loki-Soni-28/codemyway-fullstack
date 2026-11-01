# CodeMyWay

Website and student platform for CodeMyWay (codemyway.tech).

| Folder | What it is | Runs on |
|---|---|---|
| `frontend/` | The website: Vite + React + Tailwind | http://localhost:3000 |
| `backend/` | The API: Next.js (API only) + Prisma + PostgreSQL | http://localhost:4000 |

In development the frontend forwards every `/api/...` request to the backend, so the browser only talks to port 3000.

---

## 1. What to install first (one time)

| Tool | Version | Why | Get it |
|---|---|---|---|
| **Node.js** | 20.19 or newer (22 recommended, see `.nvmrc`) | runs both apps | https://nodejs.org (LTS) |
| **Git** | any | download the code | https://git-scm.com |
| **A PostgreSQL database** | 15+ | stores users, courses, payments | pick **one** option in step 4 |
| **VS Code** (optional) | any | editor | https://code.visualstudio.com |

Check Node is installed: open a terminal and run `node -v`. It should print `v20.19` or higher.

You also need these free accounts for the full experience:

| Account | Needed for | Required to just see the site? |
|---|---|---|
| **Google Cloud** (OAuth client) | "Sign in with Google" (the only login method) | Only to log in |
| **Razorpay** (test mode) | Payments | Only to test paying |
| **Google AI Studio** (Gemini key) | The student AI assistant | No, it falls back to canned replies in development |

---

## 2. Download the code

```bash
git clone <your-repository-url> codemyway-fullstack
cd codemyway-fullstack
```

---

## 3. Install the packages

From the project root:

```bash
npm run install:all
```

This installs the root, `frontend/` and `backend/` packages. It can take a few minutes the first time.

---

## 4. Set up the database

Choose **one**.

**Option A: Docker (easiest if you have Docker Desktop)**

```bash
npm run db:up
```

Use this `DATABASE_URL` in step 5:

```
postgresql://postgres:password123@localhost:5432/codedojo
```

**Option B: Supabase or any hosted PostgreSQL**

Create a free project, then copy its connection string (Supabase: Project Settings → Database → Connection string) into `DATABASE_URL`.

**Option C: PostgreSQL installed on your computer**

Create an empty database, then use `postgresql://USER:PASSWORD@localhost:5432/DBNAME`.

---

## 5. Create the settings files

### `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill it in.

```env
DATABASE_URL="postgresql://..."        # from step 4
JWT_SECRET="..."                       # any random text, 32+ characters
GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
GEMINI_API_KEY=""                      # optional in development

RAZORPAY_KEY_ID="rzp_test_..."         # test keys, free
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET=""             # only needed once deployed (see below)

OFFER_ENDS_AT="2026-11-15T23:59:59+05:30"   # when the 30% early-bird offer closes
```

Generate a `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_PROXY_TARGET="http://localhost:4000"
VITE_GOOGLE_CLIENT_ID="....apps.googleusercontent.com"   # same value as the backend
```

> `.env` files hold secrets and are ignored by Git. Never commit them or paste them in chats.

### Where to get the keys

- **Google sign-in:** https://console.cloud.google.com → APIs & Services → Credentials → *Create credentials* → *OAuth client ID* → type **Web application**. Add `http://localhost:3000` under *Authorized JavaScript origins*. While the app is in *Testing*, add every person who should log in under *OAuth consent screen → Test users*.
- **Razorpay:** https://dashboard.razorpay.com → switch to **Test mode** → Settings → API Keys → Generate. Test mode is free and moves no real money.
- **Gemini (optional):** https://aistudio.google.com/apikey

---

## 6. Create the tables and sample data

```bash
npm run db:setup
```

This generates the database client, creates all tables (including payments and discount claims), and loads sample courses, mentors and demo students.

> **Warning:** the sample-data step (`prisma db seed`) **deletes existing data** in the database. Use it only on a fresh or throwaway database, never on a live one. To create tables without sample data, run `npm run db:migrate --prefix backend`.

---

## 7. Run it

```bash
npm run dev
```

Open **http://localhost:3000**. The backend runs at port 4000 and has no pages of its own.

Prefer two terminals? Run these separately and leave both open:

```bash
npm run dev --prefix backend     # terminal 1
npm run dev --prefix frontend    # terminal 2
```

A **502 error** in the browser means the backend is not running. Start it (terminal 1) and refresh.

---

## 8. Log in and look around

Login is **Google only**. To open the student dashboard, the account must exist and be enrolled in a course. Create a test account that is enrolled in Data Analyst:

```bash
cd backend
npx tsx prisma/create-test-admin.ts you@gmail.com "Your Name" STUDENT
```

Then on the site: **Login** → enter that email → **Sign in with Google** with the same account.

Use `ADMIN` instead of `STUDENT` for an admin account. Delete test accounts before going live.

New visitors who sign up are **not** enrolled until they pay. They see an "enrol to unlock your dashboard" page.

### Test a payment (Razorpay test mode)

1. Log in, open **Programs**, click **Buy Now**.
2. Pay with the test UPI ID `success@razorpay`, or one of Razorpay's test cards (see their docs).
3. After success you are enrolled and the dashboard unlocks.

### Test the 30% early-bird offer

1. Open the site in a fresh browser window. The offer popup opens right away.
2. Claim it with an email, then sign in with that same email and pay. The discount applies only to that email, once.

---

## 9. Where to edit content

| What | File |
|---|---|
| Mentor cards (replace the sample ones before launch) | `frontend/src/siteConfig.ts` |
| Company names strip, social links | `frontend/src/siteConfig.ts` |
| About page team, stats, learner stories | `frontend/src/components/about/aboutConfig.ts` |
| Company details, refund rules, contact info | `frontend/src/components/legal/policyConfig.ts` |
| Course prices | database (`Course.price`); sample values in `backend/prisma/seed.ts` |
| Offer end date and percentage | `OFFER_ENDS_AT` in `backend/.env`; percent in `backend/src/lib/discount.ts` |
| Brochure PDF content | built from the course data in `frontend/src/components/courses/CourseDetailsPage.tsx` |

---

## 10. Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | start frontend and backend together |
| `npm run build` | production build of both |
| `npm run lint --prefix frontend` | type-check the frontend |
| `npx tsc --noEmit` (inside `backend/`) | type-check the backend |
| `npm run db:migrate --prefix backend` | apply new database migrations |
| `npx prisma studio` (inside `backend/`) | browse the database in the browser |

---

## 11. Troubleshooting

| Problem | Fix |
|---|---|
| `502` or "Request failed (502)" | The backend is not running. Start `npm run dev --prefix backend`. |
| "Could not start payment" | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` missing in `backend/.env`. Restart the backend after editing. |
| Google button is grey or says sign-in failed | `VITE_GOOGLE_CLIENT_ID` missing, `http://localhost:3000` not added as an authorized origin, or your email is not a test user. |
| "Student profile not found" / dashboard locked | The account is not enrolled. Run the test-account command in step 8, or pay for a course. |
| `EPERM ... query_engine` when running `prisma generate` | Stop the backend first, run the command, then start it again. |
| `JWT_SECRET is not set` | Add it to `backend/.env`. |
| Cannot connect to database | Check `DATABASE_URL`, and that Docker or PostgreSQL is running. |
| Port 3000 or 4000 already in use | Close the other program using it, or stop the old terminal. |

---

## 12. Going live (summary)

Full checklist: see `DEPLOYMENT_CHANGES.md`. The essentials:

1. Deploy the backend and frontend so that `/api` on your domain reaches the backend.
2. Set the production environment variables (same names as `backend/.env`) with **live** Razorpay keys.
3. Run `npx prisma migrate deploy` in `backend/`. **Do not** run the seed on production.
4. In Razorpay: add a webhook to `https://<your-domain>/api/payments/webhook` for the events `payment.captured` and `order.paid`, and put its secret in `RAZORPAY_WEBHOOK_SECRET`.
5. Replace sample content (mentors), fill in `policyConfig.ts`, confirm every claim on the site is true, and remove test accounts.

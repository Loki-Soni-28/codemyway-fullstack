# CodeMyWay Fullstack

- `frontend/` – Vite + React app (from codemyway-frontend), dev server on :3000, proxies `/api` to the backend
- `backend/`  – Next.js API-only app + Prisma/PostgreSQL (from codedojo), on :4000

## Run
 run command - cd C:\Users\naren\OneDrive\Documents\GitHub\codemyway-fullstack
node node_modules/concurrently/dist/bin/concurrently.js -n backend,frontend -c blue,green "node backend/node_modules/next/dist/bin/next dev backend -p 4000" "node frontend/node_modules/vite/bin/vite.js frontend --port=3000 --host=0.0.0.0"


1. Node >= 20.19 (`nvm use`), PostgreSQL 15 running (`npm run db:up` if you have Docker)
2. `npm run install:all`
3. `backend/.env` (copy from `.env.example`, adjust `DATABASE_URL`)
4. `npm run db:setup`   # generate client, migrate, seed
5. `npm run dev`        # http://localhost:3000

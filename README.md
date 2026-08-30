# أكاديمية مسار — Masar Academy

A full-stack Arabic (RTL) educational platform: Next.js frontend + a real
Node.js/TypeScript/PostgreSQL backend, connected end-to-end.

```
masar-academy/
├── frontend/   Next.js 16 + TypeScript + shadcn/ui + Axios + React Query
└── server/     Node.js + TypeScript + Express + Prisma ORM + PostgreSQL
```

## Quick start

You need PostgreSQL running locally (or point `DATABASE_URL` at any Postgres
instance).

```bash
# 1. Backend
cd server
npm install                 # also runs `prisma generate`
cp .env.example .env        # edit DATABASE_URL etc. if needed
npm run db:migrate          # creates & applies the initial migration
npm run db:seed             # seed subjects/teachers/courses/lessons/quizzes
npm run dev                 # http://localhost:4000

# 2. Frontend (separate terminal)
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm run dev                 # http://localhost:3000
```

### Demo accounts (seeded, password `password123` for all)

| Role    | Email                                    |
|---------|-------------------------------------------|
| Teacher | ahmed.elsayed@masar-academy.com            |
| Teacher | mona.fathy@masar-academy.com               |
| Teacher | sara.ibrahim@masar-academy.com             |
| Teacher | hassan.aboulfotouh@masar-academy.com       |
| Student | youssef.mostafa@example.com                |

Log in as a teacher to use `/teacher/dashboard`; log in as the student (or
register a new one) to browse courses and take quizzes.

## Architecture at a glance

**Backend** — layered/feature-module structure under `server/src/modules/*`
(`auth`, `subjects`, `teachers`, `courses`, `lessons`, `teacherConsole`,
`reviews`), each with its own `*.routes.ts` → `*.controller.ts` →
`*.service.ts`, plus shared `middlewares/`, `utils/`, and `db/` (Drizzle
schema + migrations + seed).

**Prisma with the driver-adapter architecture:** Prisma 7 uses a WASM query
compiler + an explicit driver adapter (`@prisma/adapter-pg` wrapping
`pg`/node-postgres) rather than a bundled native query-engine binary — this
is the standard, documented way to use Prisma 7 with Postgres. See
`server/README.md` for a note on the one CLI step (`prisma migrate`'s
schema-engine download) that needed a workaround in the sandboxed
environment this was built in, and why it won't affect you on a normal
machine.

**Auth & authorization** — JWT access tokens (15 min, kept in memory on the
frontend, never in localStorage) + rotated refresh tokens (30 days, httpOnly
cookie, hashed in the database, single-use with reuse detection that revokes
the whole session chain). Role-based authorization (`STUDENT` / `TEACHER`)
via Express middleware on the backend and a `RequireRole` guard component on
the frontend. See `frontend/src/providers/auth-provider.tsx` and
`server/src/modules/auth/` for the full flow, and each README below for more
detail.

**Frontend data layer** — Axios instance with an interceptor that attaches
the in-memory access token and automatically refreshes-and-retries on a 401
(with request queuing so concurrent 401s don't race the refresh). All server
state is fetched/mutated through React Query hooks in
`frontend/src/hooks/use-*.ts` — no more static mock-data imports for
anything the backend actually serves.

## What's real vs. illustrative

Everything listed as wired below hits the real API and is backed by
PostgreSQL. A few pieces remain intentionally out of scope for this pass and
are clearly marked in the UI/code:

- **Not yet connected:** editing your profile, changing your password, and
  student course enrollment/progress tracking (the "دوراتي" tab on the
  profile page shows sample data — there's no enrollment table/endpoints
  yet). Teacher registration is seed-only; there's no public teacher
  sign-up flow (matches a real platform's vetted-onboarding pattern).
- **Illustrative dashboard charts:** the teacher dashboard's student-growth,
  quiz-performance, content-mix, and completion-rate charts use sample data
  (no analytics endpoints exist yet). The stat cards for students/courses/
  lessons/rating and the "students per course" chart *are* real.
- **Everything else** — registration, login, browsing subjects/teachers/
  courses/lessons, watching a lesson, taking a quiz (graded server-side,
  correct answers withheld until submission), rating a teacher or the
  platform, and the full teacher course/lesson/PDF/quiz management flow —
  is wired to the real backend.

See `frontend/README.md` and `server/README.md` for full details on each half.

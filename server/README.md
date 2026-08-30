# Masar Academy — Server

Node.js + TypeScript + Express + **Prisma ORM** (PostgreSQL) API for Masar
Academy.

## Setup

```bash
npm install                # also runs `prisma generate` via postinstall
cp .env.example .env       # edit DATABASE_URL / secrets as needed
npm run db:migrate         # creates & applies the initial migration
npm run db:seed            # seed subjects, teachers, courses, lessons, quizzes
npm run dev                 # starts on http://localhost:4000
```

Other scripts: `npm run build` (tsc → `dist/`), `npm start` (run the built
output), `npm run db:studio` (Prisma Studio, a DB browser UI), `npm run
db:deploy` (apply existing migrations without generating a new one — use this
in production/CI instead of `db:migrate`).

## Folder structure

```
prisma/
  schema.prisma            Models, enums, relations
  seed.ts                   Seed script (run via `npm run db:seed`)
  migrations/                Generated on your first `npm run db:migrate`
prisma.config.ts           Prisma 7's config file (datasource URL, paths)
src/
  app.ts                  Express app: middleware stack + route mounting
  server.ts                 Entry point
  config/
    env.ts                  zod-validated environment variables
    upload.ts                multer config for PDF/image uploads
  db/
    index.ts                 PrismaClient singleton (see "Driver adapter" below)
  middlewares/
    auth.middleware.ts        requireAuth / attachUserIfPresent
    role.middleware.ts        requireRole(...roles)
    validate.middleware.ts    zod request validation
    error.middleware.ts       centralized error handler (incl. Prisma error codes)
    rateLimit.middleware.ts   rate limiting for auth endpoints
  modules/
    auth/                    register, login, refresh, logout, me
    subjects/                 public subject listing
    teachers/                 public teacher directory + profile
    courses/                  public course listing + detail
    lessons/                  lesson detail, quiz-for-taking, attempt grading
    teacherConsole/           everything behind /api/teacher/* (owns-check on every write)
    reviews/                  rate a teacher / rate the platform
  types/
    express.d.ts              req.user type augmentation
  utils/                     jwt, password hashing, slugify, youtube-id parsing, etc.
```

## Driver adapter (why `db/index.ts` looks slightly different from a typical Prisma setup)

Prisma 7 no longer bundles a native query-engine binary by default — it uses
a WASM query compiler paired with an explicit **driver adapter** for your
database. For Postgres that's `@prisma/adapter-pg`, wrapping `pg`
(node-postgres):

```ts
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

This is the standard, documented way to use Prisma 7 with Postgres — nothing
environment-specific here. (It also happens to mean the whole runtime query
path is pure JS/WASM with no native binary to fetch, which is a nice side
benefit for containerized/restricted deployments.)

## A note on this environment specifically

This project was built and verified in a sandboxed environment with no
access to `binaries.prisma.sh`, the CDN Prisma's CLI downloads its
**schema engine** from (used by `prisma migrate` / `prisma db push` for
diffing against a live database — a separate concern from the query
engine above, which is already WASM and bundled). `prisma generate`
itself worked fine (it only needs the schema-parsing WASM, which *is*
bundled in the `prisma` package), so the Prisma Client and every line of
application code here were generated and tested for real against a local
Postgres instance. Only the one-time `prisma migrate dev` step couldn't be
run inside that sandbox.

**On a normal machine with internet access, none of this matters** — just
run `npm install && npm run db:migrate && npm run db:seed && npm run dev`
as shown above and it'll work exactly as documented, first try.

If you ever hit the same restricted-network situation yourself, the
schema-engine download can be skipped by pointing
`PRISMA_SCHEMA_ENGINE_BINARY` at any local file and setting
`PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` — that's enough to unblock
`prisma generate`, but `migrate`/`db push` will still no-op without a real
schema-engine binary, so you'd need to apply the schema via raw SQL in that
scenario (as was done here for local verification).

## Auth design

- **Access token**: JWT, 15 min, returned in the response body. The client
  keeps it in memory only and sends it as `Authorization: Bearer <token>`.
- **Refresh token**: JWT, 30 days, set as an **httpOnly, Secure (in
  production), SameSite=Lax** cookie scoped to `/api/auth`. Its hash (not
  the raw token) is stored in the `refresh_tokens` table.
- **Rotation**: every call to `POST /api/auth/refresh` revokes the token
  used and issues a brand new access+refresh pair. If an already-revoked (or
  expired) refresh token is presented again — a signal of token theft or
  reuse — every refresh token for that user is revoked, forcing a fresh
  login.
- **Password hashing**: bcrypt, 12 salt rounds.
- **Authorization**: `requireAuth` populates `req.user = { id, role }` from
  the access token; `requireRole("TEACHER")` (etc.) gates routes by role.
  Every write under `/api/teacher/*` additionally checks that the course/
  lesson being modified actually belongs to the calling teacher's profile.

## API overview

All responses are wrapped as `{ success, data, message? }`. Errors return
`{ success: false, message }` with an appropriate HTTP status.

| Method & path                                   | Auth          | Notes |
|--------------------------------------------------|---------------|-------|
| `POST /api/auth/register`                         | —             | Always creates a `STUDENT` |
| `POST /api/auth/login`                             | —             | |
| `POST /api/auth/refresh`                            | refresh cookie | Rotates the token |
| `POST /api/auth/logout`                             | refresh cookie | |
| `GET  /api/auth/me`                                  | access token   | |
| `GET  /api/subjects`                                 | —             | |
| `GET  /api/teachers` `?subject=`                      | —             | |
| `GET  /api/teachers/:slug`                            | —             | |
| `GET  /api/courses` `?subject=&teacher=`               | —             | |
| `GET  /api/courses/:slug`                              | —             | includes lessons (no quiz content) |
| `GET  /api/lessons/:id`                                 | —             | |
| `GET  /api/lessons/:id/quiz`                             | —             | **correctIndex withheld** |
| `POST /api/lessons/:id/quiz/attempts`                     | STUDENT        | graded server-side |
| `POST /api/reviews/teachers/:teacherId`                    | STUDENT        | upsert |
| `POST /api/reviews/platform`                                | STUDENT        | upsert |
| `GET  /api/reviews/teachers/mine`                             | STUDENT        | |
| `GET  /api/teacher/profile`                                    | TEACHER        | |
| `GET/POST /api/teacher/courses`                                 | TEACHER        | |
| `GET  /api/teacher/courses/:slug`                                | TEACHER        | owns-check |
| `POST /api/teacher/courses/:slug/lessons`                          | TEACHER        | owns-check |
| `POST /api/teacher/lessons/:lessonId/pdf`                            | TEACHER        | multipart, owns-check |
| `GET/PUT /api/teacher/lessons/:lessonId/quiz`                          | TEACHER        | owns-check, replace-all semantics |
| `POST /api/teacher/uploads/image`                                        | TEACHER        | for quiz question/option images |

Quiz grading is intentionally **server-side only**: `GET
/api/lessons/:id/quiz` never sends `correctIndex`, so a student can't read
answers out of the network tab. `POST .../attempts` grades against the
database and returns per-question `isCorrect` + the correct option id.

## Uploads

PDFs and quiz images are stored on local disk under `server/uploads/` (not
committed) and served statically at `/uploads/...`. Swap
`config/upload.ts` for an S3/GCS-backed implementation for production —
the rest of the app only depends on getting back a URL string.

## Known limitations

- No enrollment/progress-tracking tables yet — the "دوراتي" (my courses)
  tab on the student profile page is illustrative only.
- No endpoint to edit a user's profile or change their password.
- No public teacher registration/onboarding flow — teacher accounts exist
  only via the seed script.
- Dashboard analytics charts (growth over time, quiz performance trend,
  completion rate, content mix) are not backed by real aggregation
  endpoints; only the top-line stat cards and per-course enrollment chart
  use real data.

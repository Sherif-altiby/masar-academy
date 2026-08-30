# أكاديمية مسار — Educational Platform (Frontend, Arabic RTL)

A Next.js + TypeScript + shadcn/ui frontend for a K-12 online tutoring
platform, fully in Arabic with RTL layout, a teacher dashboard, and a real
backend connection (Axios + React Query). Light/dark mode included.

**This app needs the backend running to load any data.** See the root
`../README.md` for full setup, or the short version:

```bash
# from ../server
npm install && npm run db:generate && npm run db:migrate && npm run db:seed && npm run dev
```

## Getting started

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm run dev
```

Then open http://localhost:3000

## Data layer (Axios + React Query)

- `src/lib/api-client.ts` — the Axios instance. A request interceptor
  attaches the in-memory access token; a response interceptor catches 401s,
  calls `/auth/refresh` (queuing concurrent 401s onto the same refresh
  promise so they don't race), and retries the original request once.
- `src/lib/token-store.ts` — the access token lives in a module-level
  variable only, never localStorage/sessionStorage, to limit XSS exposure.
- `src/providers/auth-provider.tsx` — the auth context. On mount, silently
  trades the httpOnly refresh cookie for a new access token (so a page
  reload doesn't log you out); exposes `login`, `register`, `logout`,
  `user`, `isTeacher`, `isStudent`.
- `src/providers/query-provider.tsx` — the `QueryClientProvider`.
- `src/hooks/use-*.ts` — one file per resource (subjects, teachers, courses,
  lessons, reviews, teacher-console), each exporting typed React Query
  hooks (`useQuery`/`useMutation`) that call the API client.
- `src/components/shared/require-role.tsx` — route guard used by the
  teacher dashboard layout; redirects to `/login` if unauthenticated, or
  `/` if authenticated with the wrong role.

## Structure

- `src/app/(site)/...` — the public/student-facing site (route group, has the
  marketing header + footer via its own layout)
- `src/app/teacher/dashboard/...` — the teacher dashboard (its own layout,
  sidebar + top bar, no marketing header/footer)
- `src/app/layout.tsx` — root layout: just fonts, theme provider, and the
  toaster; each route group supplies its own chrome

## Public site pages

- **Home** — animated hero (framer-motion), about, subjects teaser, teachers
  teaser, a marquee testimonials/ratings section, footer
- **/register** — full name, email, phone, parent's phone, level, password
- **/login**
- **/subjects** — dedicated searchable subjects page
- **/teachers** — searchable & filterable teacher directory
- **/teachers/[slug]** — teacher profile: about, subject, courses, reviews, "rate this teacher"
- **/courses/[slug]** — lessons as cards, with PDF/quiz badges where present, progress bar
- **/courses/[slug]/lessons/[lessonId]** — every lesson is a YouTube video, with
  optional PDF and/or quiz sections shown beneath it
- **/courses/[slug]/lessons/[lessonId]/quiz** — interactive quiz with a live
  countdown timer that auto-submits when time runs out
- **/profile** — edit profile, enrolled courses, rate teachers/platform, change password

## Teacher dashboard (`/teacher/dashboard`)

The signed-in teacher for this design is always Ahmed El-Sayed (`t1` in
`src/data/mock-data.ts`) — see `src/data/teacher-dashboard-data.ts`.

- **/teacher/dashboard** — overview: 6 stat cards (students, courses, lessons,
  rating, video views, quiz completion rate), a student-growth area chart, a
  quiz-performance line chart, a per-course enrollment bar chart, a content-mix
  donut chart (video-only vs. video+PDF vs. video+quiz vs. all three), a
  course-completion-rate bar chart, recent reviews, and a quick course list
  (charts built with `recharts`, colored using the same CSS-variable tokens
  as the rest of the app)
- **/teacher/dashboard/courses** — manage all of the teacher's courses (each
  card links straight to lesson management — no "preview as student" here,
  that's still available one level down on each lesson row)
- **/teacher/dashboard/courses/new** — add-course form (title, description,
  subject, level, free/paid)
- **/teacher/dashboard/courses/[slug]** — manage a course's lessons, with
  quick links to add/edit each lesson's PDF or quiz
- **/teacher/dashboard/courses/[slug]/lessons/new** — add-lesson form
  (title, description, duration, order, YouTube URL/ID, free-preview toggle)
- **/teacher/dashboard/pdf/new** — standalone "add PDF" page: pick a course,
  then a lesson, then upload/replace its PDF (drag-and-drop UI with a live
  preview of the selected file)
- **/teacher/dashboard/quiz/new** — standalone "create quiz" page: pick a
  course, then a lesson, then build its quiz (add/remove questions, edit
  options, pick the correct answer, set the time limit)
- **/teacher/dashboard/courses/[slug]/lessons/[lessonId]/pdf** — same PDF form,
  scoped directly to one lesson (reached from the course's lesson-management page)
- **/teacher/dashboard/courses/[slug]/lessons/[lessonId]/quiz** — same quiz
  builder, scoped directly to one lesson

A shortcut to the dashboard is in the profile dropdown menu in the site
header ("لوحة تحكم المدرّس"). Both PDF-upload and quiz-builder forms are
shared components (`src/components/teacher/pdf-upload-form.tsx` and
`src/components/teacher/quiz-builder-form.tsx`) — the standalone `/pdf/new`
and `/quiz/new` pages just add a course/lesson picker in front of them, and
the lesson-scoped pages pass the lesson's existing data straight in for
editing.

## Lessons: video + optional PDF/quiz

Each `Lesson` (see `src/types/index.ts`) always has a `videoId` (embedded via
`src/components/shared/youtube-player.tsx`), and can independently have:

- `hasPdf` / `pdfPages` — shows a PDF card under the video
- `hasQuiz` / `quiz` / `quizDurationSeconds` — shows a "start quiz" card under
  the video, linking to the quiz page with a countdown timer

All lessons in the mock data currently point to the same placeholder video ID
(`aqz-KE-bpKQ`, a Creative Commons sample) — swap `videoId` per lesson for
real lecture videos.

## Quiz timer

`src/components/shared/quiz-runner.tsx` (student-facing) counts down from
`durationSeconds`, turns red under 20% of the time remaining, and
automatically submits the quiz when the timer hits zero. The teacher-facing
quiz builder lets you set that duration in minutes per lesson.

## Quiz content: images, language, and code

Each `QuizQuestion` (see `src/types/index.ts`) can independently have:

- `imageUrl` — an image shown above the question text (e.g. a diagram)
- `options: QuizOption[]` — each option is `{ text?, imageUrl? }`, so an
  option can be text-only, image-only, or both (see the "which shape is a
  circle" example in `src/data/mock-data.ts`)
- `contentType: "ar" | "en" | "code"` — controls both direction and font:
  - `"ar"` (default) — right-to-left, Arabic-first font
  - `"en"` — left-to-right, Latin text
  - `"code"` — left-to-right, monospace, rendered in a code block, with an
    optional `codeLanguage: "python" | "javascript"` shown as a small badge

`src/lib/quiz-content.ts` has the small helpers (`getContentDir`,
`getContentFontClass`, `getContentTextAlign`) that both the student-facing
`QuizRunner` and the teacher-facing `QuizBuilderForm` use, so direction/font
handling stays consistent between taking and building a quiz. In the builder,
picking "English" or "Code" for a question flips that question's textarea
and option inputs to `dir="ltr"` immediately; question and option images are
picked via a real file input and previewed with an object URL (nothing is
actually uploaded anywhere, same as the standalone PDF page).

## Language and direction

The whole app is in Arabic with dir="rtl" set on the html element. Email,
phone, video-URL, and password fields are kept dir="ltr" so digits and Latin
characters display correctly while staying right-aligned in the form.

## Fonts

Self-hosted via @fontsource (works fully offline, no Google Fonts network
call needed): Tajawal (headings) and Cairo (body), imported in
src/app/layout.tsx.

## Design system

All colors live in src/app/globals.css as CSS variables (light + dark),
mapped into Tailwind's @theme. No color is used anywhere in the app —
including the dashboard charts — that isn't defined there.

## Static/sample data still in use

Most pages now fetch from the real API — see "Data layer" above. A few
files under `src/data/` remain in use for content the backend doesn't (yet)
serve:

- `src/data/mock-data.ts` — only `COURSES` is still referenced, for the
  illustrative "دوراتي" (my courses) tab on the student profile page (no
  enrollment endpoint exists yet)
- `src/data/testimonials.ts` — the home page's testimonials marquee (no
  testimonials endpoint/table exists)
- `src/data/teacher-dashboard-data.ts` — sample chart series for the
  teacher dashboard's growth/performance/completion-rate/content-mix
  charts (no analytics endpoints exist); the stat cards and per-course
  enrollment chart next to them use real data

`src/types/index.ts` still holds `LEVEL_OPTIONS` and a couple of shared UI
types (`Subject`, `Level`) used for select inputs — the source of truth for
API response shapes is `src/lib/api-types.ts`.

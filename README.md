# Elevare-SaaS — Project Screening Report

This document provides a comprehensive screening of the repository, including the project structure, database structure, implemented features, setup instructions, APIs, and recommendations.

Last updated: 2025-09-27 16:00 (local)


## 1) Tech Stack Overview
- Runtime & Framework
  - Next.js 14 (App Router) with React 18
  - TypeScript
- Authentication
  - NextAuth (JWT sessions) with Prisma Adapter
  - Credentials provider (email/password); OAuth buttons present in UI but disabled
- Database & ORM
  - PostgreSQL via Prisma 6
- Styling & UI
  - Tailwind CSS v4
  - Radix UI components
  - lucide-react icons
  - shadcn-like UI primitives under src/components/ui
- Utilities
  - zod, react-hook-form, date-fns, dnd-kit, sonner toasts
- Tooling
  - tsx for scripts (e.g., seeding)


## 2) Scripts, Build, and Run
Defined in package.json:
- dev: next dev
- build: prisma generate && next build
- start: next start
- lint: next lint
- db:seed: tsx src/lib/mock-data-seed.ts

Typical workflow:
1) Copy .env.example to .env and configure variables (see section 7).
2) Install dependencies: npm i (or bun/pnpm per your tooling).
3) Generate Prisma client: npx prisma generate (or via build script).
4) Apply migrations: npx prisma migrate dev (create an init migration if none exist).
5) Seed demo data (optional): npm run db:seed.
6) Run dev server: npm run dev.


## 3) Project Structure
Root-level items:
- README.md — project documentation (this file)
- bun.lock — lockfile
- components.json — component configuration
- middleware.ts — NextAuth middleware protecting app routes
- next-env.d.ts, tsconfig.json — TypeScript configuration
- next.config.mjs — Next.js config
- postcss.config.mjs — PostCSS config
- prisma/ — Prisma schema and (expected) migrations
  - schema.prisma — database models
- public/ — static assets (e.g., placeholder images)
- src/
  - app/
    - page.tsx — Landing page (marketing/CTA)
    - (auth)/
      - login/page.tsx — Login UI (credentials)
      - register/page.tsx — Registration UI and flow
    - (main)/
      - dashboard/page.tsx — Dashboard view (fetches projects and tasks)
      - projects/
        - page.tsx — Project list
        - new/page.tsx — Create project
        - [id]/page.tsx — Project detail
        - [id]/edit/page.tsx — Edit project
      - tasks/
        - page.tsx — Task list + CRUD/reorder interactions
        - [id]/page.tsx — Task detail
      - settings/
        - page.tsx — Settings landing
        - profile/page.tsx — Profile settings
    - api/
      - register/route.ts — Public registration endpoint
      - projects/route.ts — List + Create projects
      - projects/[id]/route.ts — Get/Update/Delete a project
      - tasks/route.ts — List + Create tasks
      - tasks/reorder-batch/route.ts — Batch update task positions
  - components/
    - app-header.tsx, app-sidebar.tsx — Layout/navigation pieces
    - task-modal.tsx — Create/Update task modal form
    - ui/ — basic UI inputs and elements
  - lib/
    - auth.ts — NextAuth configuration
    - prisma.ts — Prisma client
    - utils.ts — utilities (cn, date formatters, activityLog)
    - mock-data-seed.ts — demo seed script


## 4) Authentication & Middleware
- NextAuth configured with PrismaAdapter and CredentialsProvider.
  - Session strategy: JWT (24h maxAge)
  - jwt/session callbacks set session.user.id from token
- Sign-in page
  - authOptions.pages.signIn = "/auth/signin" (note: no such route exists; actual login page is "/login")
- Middleware (middleware.ts)
  - Protects routes: /dashboard, /projects/*, /tasks/*, /settings/*
  - Redirects to /login for unauthenticated users

Recommendation: Align authOptions.pages.signIn with "/login" to avoid inconsistent redirect paths (see section 10).


## 5) Database Structure (Prisma)
Datasource: PostgreSQL (env DATABASE_URL)

Models and relations:
- User
  - id (cuid, PK)
  - name, email (unique), password (hashed), avatarUrl, bio, location, website, company
  - timezone (default "America/Los_Angeles"), language (default "en")
  - Relations: projects [Project], tasks [Task], activities [Activity]
  - Timestamps: createdAt, updatedAt

- Project
  - id (cuid, PK)
  - name, description, status (default "active"), color
  - startDate, endDate
  - userId (FK to User, onDelete: Cascade)
  - Relations: tasks [Task], activities [Activity]
  - Timestamps: createdAt, updatedAt

- Task
  - id (cuid, PK)
  - title, description
  - status (default "todo")
  - priority (default "medium")
  - dueDate, position (for ordering)
  - projectId (FK to Project, onDelete: Cascade)
  - userId (FK to User, onDelete: Cascade)
  - Relations: activities [Activity]
  - Timestamps: createdAt, updatedAt

- Activity
  - id (cuid, PK)
  - action, details
  - userId (FK to User, onDelete: Cascade)
  - projectId (nullable FK), taskId (nullable FK)
  - createdAt

Notes:
- status/priority are strings, not Prisma enum types – flexible but less constrained.
- Cascading deletes remove dependent records.


## 6) Feature Overview
- Public marketing landing page at "/" with CTA and sections (features, testimonials, CTA).
- Registration flow (UI at /register, API at POST /api/register):
  - Creates user with hashed password, then auto-login via NextAuth credentials.
- Login flow (UI at /login) with credentials. OAuth buttons present but commented out.
- Auth-protected application areas (via middleware):
  - Dashboard: aggregates latest projects and tasks via APIs.
  - Projects: list, create (unique-name suffix logic), view details, edit, delete. Activity logs on create/update/delete.
  - Tasks: list, create, view details, delete; drag/drop reorder via /api/tasks/reorder-batch; activity logs on create.
  - Settings: general and profile page placeholders.
- Activity logging utility persists important user actions.
- Demo data seeding script to quickly populate a working demo account.


## 7) Environment Variables
Create .env by copying .env.example:

- Copy: cp .env.example .env (PowerShell: Copy-Item .env.example .env)
- Fill in the values as needed.

Required:
- DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
- NEXTAUTH_SECRET=your-generated-secret

Optional (recommended in prod):
- NEXTAUTH_URL=https://your.domain

See .env.example for guidance and sample values.


## 8) API Endpoints Summary
All endpoints except /api/register require authentication (checked via getServerSession(authOptions)). Data is user-scoped by session.user.id.

- POST /api/register
  - Body: { name, email, password }
  - Creates a user with hashed password. Returns created user.

- GET /api/projects?limit=n
  - Returns projects for current user; optional limit.
- POST /api/projects
  - Body: { name, description?, status?, color?, startDate?, endDate? }
  - Ensures uniqueness by suffixing duplicates: "Name (2)", etc.

- GET /api/projects/[id]
  - Returns a single project if owned by user.
- PUT /api/projects/[id]
  - Updates fields. Default status fallback to "planning" if not provided.
- DELETE /api/projects/[id]
  - Deletes a project owned by the user.

- GET /api/tasks
  - Returns tasks for user ordered by position asc, then createdAt desc.
- POST /api/tasks
  - Body: { title, description?, status?, priority?, dueDate?, projectId }
  - Requires title and projectId. Computes next position within project.

- PUT /api/tasks/reorder-batch
  - Body: { updates: [{ taskId, newPosition, projectId }, ...] }
  - Batch updates positions within a transaction.

Notes:
- Activity logs on project create/update/delete and task create are saved via src/lib/utils.ts activityLog.


## 9) Seeding & Demo Account
- Run: npm run db:seed
- Script wipes tables (Activity, Task, Project, User) then inserts:
  - User: john@example.com / password (plaintext: "password")
  - Multiple projects and tasks with preset timestamps, statuses, priorities
  - Activities for a realistic timeline


## 10) Observations, Gaps, and Recommendations
- Authentication page path mismatch
  - middleware.ts signIn: "/login"; authOptions.pages.signIn: "/auth/signin"; login page exists at "/login".
  - Recommendation: set authOptions.pages.signIn = "/login" for consistency.
- Data constraints
  - status/priority stored as strings; consider Prisma enums for stricter validation and safer queries.
- Error messages
  - Some messages are in mixed languages (EN/ID). Standardize messages and i18n strategy.
- Migrations
  - No Prisma migration files included. Ensure migrations are generated and applied in CI/production.
- Security
  - Registration endpoint returns full user object. Consider omitting sensitive fields (password is not returned by Prisma default select, but double-check) and standardize responses.
  - Rate-limit auth-related endpoints and add CSRF protections where relevant (NextAuth covers session routes; custom API routes may need additional safeguards).
- OAuth
  - UI buttons exist but handlers are commented. If needed, add providers (Google, GitHub) in NextAuth config and env vars.
- Multi-tenancy
  - Current design is single-tenant per user; if team collaboration is required, introduce Organization/Team, Membership, Role models.
- Activity coverage
  - Only some actions are logged. Consider logging task updates, deletes, reorders, and login events if auditing is important.


## 11) Setup (Project Setup)
Follow these steps to run locally:

1) Clone and enter the project directory
   - git clone <repo-url>
   - cd Elevare-SaaS
2) Copy environment file and configure
   - PowerShell (Windows): Copy-Item .env.example .env
   - macOS/Linux: cp .env.example .env
   - Edit .env to set DATABASE_URL and NEXTAUTH_SECRET
3) Install dependencies
   - npm install
4) Generate Prisma client
   - npx prisma generate
5) Apply database migrations (create if none exist)
   - npx prisma migrate dev --name init
6) Seed demo data (optional but recommended)
   - npm run db:seed
   - Demo login: john@example.com / password
7) Run the development server
   - npm run dev
   - Open http://localhost:3000
8) Sign in or register
   - Use the demo login above, or visit /register to create an account


## 12) Project Structure Tree (abridged)
D:/project-kantor/Elevare-SaaS
- README.md
- middleware.ts
- prisma/
  - schema.prisma
- src/
  - app/
    - page.tsx
    - (auth)/login/page.tsx
    - (auth)/register/page.tsx
    - (main)/dashboard/page.tsx
    - (main)/projects/page.tsx
    - (main)/projects/new/page.tsx
    - (main)/projects/[id]/page.tsx
    - (main)/projects/[id]/edit/page.tsx
    - (main)/tasks/page.tsx
    - (main)/tasks/[id]/page.tsx
    - (main)/settings/page.tsx
    - (main)/settings/profile/page.tsx
    - api/
      - register/route.ts
      - projects/route.ts
      - projects/[id]/route.ts
      - tasks/route.ts
      - tasks/reorder-batch/route.ts
  - components/
    - app-header.tsx, app-sidebar.tsx, task-modal.tsx
    - ui/* (inputs and primitives)
  - lib/
    - auth.ts, prisma.ts, utils.ts, mock-data-seed.ts


## 13) License and Contributing
- License file not found; clarify licensing.
- Contribution guidelines not present; consider adding CONTRIBUTING.md and CODE_OF_CONDUCT.md if external contributions are expected.


## 14) Changelog
- Not maintained; consider adding a CHANGELOG.md.


## 15) Contacts
- Add maintainers/owner info if necessary.

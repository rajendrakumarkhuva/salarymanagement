# Employee Salary Management System (ESMS)

**Assessment Submission for ACME Org HR Manager**

A production-quality, fully functional web application that replaces Excel-based salary tracking for 10,000 employees.

---

## Table of Contents

1. [Requirements Document](#requirements-document)
2. [Architecture & Design Decisions](#architecture--design-decisions)
3. [Tech Stack](#tech-stack)
4. [How to Run](#how-to-run)
5. [How to Seed 10,000 Employees](#how-to-seed-10000-employees)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Commit History & Evolution](#commit-history--evolution)
9. [Artifacts & Thinking Process](#artifacts--thinking-process)
10. [Future Enhancements](#future-enhancements)

---

## Requirements Document

**Goal**  
Replace manual Excel-based salary tracking with a simple, reliable web application that lets the HR Manager view, update, and analyze salary data for 10,000 employees across multiple countries.

**Scope & Features (MVP)**  
- Employee & Salary Management  
  - List all employees with salary details (name, title, department, country, base salary, bonus, currency, effective date).  
  - View, edit, and add individual employee salary records.  
  - Search and filter by country, department, title, salary range.  
- Analytics & Reporting  
  - Basic dashboards: average salary by country, department, and title.  
  - Simple total payroll calculation.  
  - Export to CSV.  
- User Experience  
  - Clean, responsive web UI.  
  - Pagination and fast search on 10k records.  
- Data Integrity  
  - All changes logged with timestamps.  
  - Basic validation on salary inputs.

**Deliberately Out of Scope (and Why)**  
- User authentication / roles (single HR Manager persona → simplifies security).  
- Multi-currency conversion or tax calculation (adds complexity without core value).  
- Advanced forecasting, compensation planning, or approvals workflow (future phase).  
- Mobile app or offline support (web-first is sufficient).  
- Email notifications or detailed audit logs (overkill for MVP).  
- Multiple concurrent users (single-user assumption for assessment).

**Reasoning**  
Focus on **core salary visibility + basic analysis** to replace Excel. Keeping scope tight allows production-quality code, meaningful tests, and clear demonstration of engineering judgment.

---

## Architecture & Design Decisions

**High-Level Architecture**
┌──────────────────────────────────────────────────────────────┐
│ Browser (HR Manager) │
└──────────────────────────────┬───────────────────────────────┘
│ HTTPS
┌──────────────────────────────▼───────────────────────────────┐
│ Next.js App (Vercel) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ React UI │◄──┤ API Routes │◄──┤ Prisma │ │
│ │ (Pages + │ │ (REST/JSON) │ │ ORM │ │
│ │ Components) │ │ │ │ │ │
│ └──────────────┘ └──────────────┤ └──────┬───────┘ │
└────────────────────────────────────┼──────────┼─────────────┘
│ │
│ │ file:./dev.db
│ ▼
│ SQLite (Prisma)
│ employees table
└───────────────────────


**Key Design Decisions & Tradeoffs**

1. **Next.js full-stack** – Single codebase, shared TypeScript types, zero extra deployment. Accepted trade-off for speed and quality.
2. **SQLite + Prisma** – Extremely simple for 10k rows; excellent type safety and migrations.
3. **shadcn/ui + Tailwind** – Beautiful, accessible, copy-paste components with full code ownership.
4. **No authentication** – Assessment focuses on salary management functionality; auth would add unnecessary complexity.
5. **Server-side pagination + search** – Keeps performance excellent even at 10k records.

---

## Tech Stack

| Layer       | Technology                          | Reason |
|-------------|-------------------------------------|--------|
| Frontend    | Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui | Fast development, built-in API routes, excellent DX |
| Backend     | Next.js API routes                  | Single deploy, full-stack TypeScript |
| Database    | SQLite (Prisma ORM)                 | File-based, perfect for assessment, easy seeding |
| Seeding     | Prisma seed script                  | Reproducible, type-safe |
| Testing     | Vitest + React Testing Library      | Fast, modern, deterministic tests |
| Deployment  | Vercel                              | Zero-config for Next.js |

---

## How to Run

```bash
git clone https://github.com/rajendrakumarkhuva/salarymanagement.git
cd salarymanagement
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev


## How to Seed 10,000 Employees
The seed script is located at prisma/seed.ts.

It generates realistic data for 10,000 employees across multiple countries, departments, and titles.

npm run seed
npx prisma studio
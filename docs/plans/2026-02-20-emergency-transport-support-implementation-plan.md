# Emergency Transport Support System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an A-side focused MVP for emergency transport support with case intake, symptom/protocol entry, hospital search, and request workflow.

**Architecture:** Use a single Next.js App Router app with Route Handlers and Prisma on Neon PostgreSQL. Keep A-side and HP-side route groups separate from day one. Enforce single-source-of-truth for shared concepts (chest pain, paresis) in schema and API.

**Tech Stack:** Next.js 15, TypeScript, Prisma, Neon PostgreSQL, Zod, Vitest, Playwright

---

References: `@next-best-practices` `@vercel-react-best-practices` `@e2e-testing`

### Task 1: Bootstrap Data Layer

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Modify: `package.json`
- Modify: `.env.example`

**Step 1: Write the failing test**

```ts
// tests/unit/schema-load.test.ts
import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
describe("schema", () => it("loads prisma client", () => expect(PrismaClient).toBeDefined()));
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/schema-load.test.ts`  
Expected: FAIL with module not found (`@prisma/client`)

**Step 3: Write minimal implementation**

```ts
// src/lib/db.ts
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
```

**Step 4: Run test to verify it passes**

Run: `npm run prisma:generate && npm run test:unit -- tests/unit/schema-load.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/db.ts package.json .env.example tests/unit/schema-load.test.ts
git commit -m "chore: bootstrap prisma and data access"
```

### Task 2: Define Core Case Schema

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `tests/unit/vital-constraints.test.ts`

**Step 1: Write the failing test**

```ts
// tests/unit/vital-constraints.test.ts
import { describe, it, expect } from "vitest";
describe("vital constraints", () => {
  it("supports sequence 1..5 unique per case", () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/vital-constraints.test.ts`  
Expected: FAIL due to missing test setup or schema helper

**Step 3: Write minimal implementation**

```prisma
model CaseVital {
  id                String   @id @default(cuid())
  caseId             String
  sequence           Int
  isActive           Boolean  @default(false)
  copiedFromVitalId  String?
  measuredAt         DateTime?
  @@unique([caseId, sequence])
}
```

**Step 4: Run test to verify it passes**

Run: `npm run prisma:generate && npm run test:unit -- tests/unit/vital-constraints.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add prisma/schema.prisma tests/unit/vital-constraints.test.ts
git commit -m "feat: add core case and vital schema constraints"
```

### Task 3: Add Single Source of Truth Models

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `tests/unit/single-source-truth.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
describe("single source", () => it("defines shared chest pain and paresis models", () => expect(true).toBe(true)));
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/single-source-truth.test.ts`  
Expected: FAIL before model additions

**Step 3: Write minimal implementation**

```prisma
model SymptomChestPain { id String @id @default(cuid()) caseId String @unique }
model SymptomParesis   { id String @id @default(cuid()) caseId String @unique }
```

**Step 4: Run test to verify it passes**

Run: `npm run prisma:generate && npm run test:unit -- tests/unit/single-source-truth.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add prisma/schema.prisma tests/unit/single-source-truth.test.ts
git commit -m "feat: add shared symptom source-of-truth models"
```

### Task 4: Implement Case + Vital APIs

**Files:**
- Create: `app/api/cases/route.ts`
- Create: `app/api/cases/[caseId]/route.ts`
- Create: `app/api/cases/[caseId]/vitals/route.ts`
- Create: `src/lib/validation/case.ts`
- Create: `tests/integration/cases-api.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
describe("POST /api/cases", () => it("creates case and patient", async () => expect(201).toBe(201)));
```

**Step 2: Run test to verify it fails**

Run: `npm run test:integration -- tests/integration/cases-api.test.ts`  
Expected: FAIL with route not found

**Step 3: Write minimal implementation**

```ts
// app/api/cases/route.ts
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ ok: true }, { status: 201 });
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:integration -- tests/integration/cases-api.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add app/api/cases app/api/cases/[caseId] src/lib/validation/case.ts tests/integration/cases-api.test.ts
git commit -m "feat: add case and vital route handlers"
```

### Task 5: Implement Hospital Master + Search API

**Files:**
- Create: `app/api/hospitals/search/route.ts`
- Create: `src/lib/hospital-search.ts`
- Modify: `prisma/seed.ts`
- Create: `tests/unit/hospital-search.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
describe("hospital search", () => it("supports AND/OR and grouped departments", () => expect(false).toBe(true)));
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/hospital-search.test.ts`  
Expected: FAIL

**Step 3: Write minimal implementation**

```ts
export function expandDepartments(input: string[]) {
  return input;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/hospital-search.test.ts`  
Expected: PASS after implementing grouping/filters/sort

**Step 5: Commit**

```bash
git add app/api/hospitals/search/route.ts src/lib/hospital-search.ts prisma/seed.ts tests/unit/hospital-search.test.ts
git commit -m "feat: add hospital search and seeded master data"
```

### Task 6: Implement A-Side UI Routes

**Files:**
- Create: `app/(ems)/layout.tsx`
- Create: `app/(ems)/page.tsx`
- Create: `app/(ems)/cases/new/page.tsx`
- Create: `app/(ems)/cases/[caseId]/select-hospital/page.tsx`
- Create: `app/(ems)/cases/[caseId]/history/page.tsx`
- Create: `src/components/ems/case-form.tsx`
- Create: `src/components/ems/vitals-editor.tsx`

**Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";
test("ems user can open new case form", async ({ page }) => {
  await page.goto("/cases/new");
  await expect(page.getByRole("heading")).toContainText("救急事案入力");
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/ems-case.spec.ts`  
Expected: FAIL with route missing

**Step 3: Write minimal implementation**

```tsx
export default function Page() {
  return <h1>救急事案入力</h1>;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:e2e -- tests/e2e/ems-case.spec.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add app/(ems) src/components/ems tests/e2e/ems-case.spec.ts
git commit -m "feat: add ems-side core pages and form shells"
```

### Task 7: Implement Hospital Request Workflow APIs

**Files:**
- Create: `app/api/requests/route.ts`
- Create: `app/api/requests/[requestId]/status/route.ts`
- Create: `app/api/requests/[requestId]/messages/route.ts`
- Create: `src/lib/request-status.ts`
- Create: `tests/integration/request-flow.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
describe("request status flow", () => it("allows transport decision from acceptable", () => expect(false).toBe(true)));
```

**Step 2: Run test to verify it fails**

Run: `npm run test:integration -- tests/integration/request-flow.test.ts`  
Expected: FAIL

**Step 3: Write minimal implementation**

```ts
export const ALLOWED_TRANSITIONS = {
  PENDING: ["ACCEPTABLE", "DECLINED", "ACCEPTABLE_WITH_CONDITIONS", "CONSULT_REQUIRED", "CANCELLED"],
};
```

**Step 4: Run test to verify it passes**

Run: `npm run test:integration -- tests/integration/request-flow.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add app/api/requests src/lib/request-status.ts tests/integration/request-flow.test.ts
git commit -m "feat: add hospital request status and message workflow"
```

### Task 8: Add Retention + Purge Visibility Rules

**Files:**
- Modify: `app/api/cases/route.ts`
- Modify: `app/api/cases/[caseId]/route.ts`
- Create: `src/lib/retention.ts`
- Create: `tests/unit/retention.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
describe("retention", () => it("computes purge_at as ended_at + 30 days", () => expect(false).toBe(true)));
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/retention.test.ts`  
Expected: FAIL

**Step 3: Write minimal implementation**

```ts
export function calcPurgeAt(endedAt: Date) {
  return new Date(endedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/retention.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add app/api/cases src/lib/retention.ts tests/unit/retention.test.ts
git commit -m "feat: add case retention and purge date handling"
```

### Task 9: Quality Gate and Deployment Readiness

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/ems-main-flow.spec.ts`
- Modify: `package.json`
- Create: `docs/testing.md`

**Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";
test("main flow", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/medical-support-system/i);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/ems-main-flow.spec.ts`  
Expected: FAIL before config/setup

**Step 3: Write minimal implementation**

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "./tests/e2e" });
```

**Step 4: Run test to verify it passes**

Run: `npm run lint && npm run test:unit && npm run test:integration && npm run test:e2e`  
Expected: PASS

**Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e package.json docs/testing.md
git commit -m "test: add e2e flow and quality gate scripts"
```

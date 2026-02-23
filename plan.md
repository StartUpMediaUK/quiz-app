# Quizr v2 Architecture Specification
## Multi-Org, Single-App, Normalized Questions, Clerk Auth

---

# 1. High-Level Architecture

## Runtime Shape: U1 (Single Next.js App)

One Next.js application will serve:

- `/` -> Marketing
- `/app/**` -> Authenticated Dashboard (organisation-scoped)
- `/f/[slug]` -> Public forms (platform domain)
- `/{slug}` -> Public forms (custom domain only)

Payload CMS will remain temporarily but will be removed later in favor of an internal lead funnel page builder.

---

# 2. Terminology

We will use **Organisation** (not Tenant).

All organisation-owned resources must be scoped by `organisationId`.

---

# 3. Authentication

## Provider: Clerk

Clerk will handle:
- Identity
- Sessions
- OAuth
- Email/password
- Invitations (optional usage)

Clerk will NOT own the domain model.
Organisation and membership remain in our database.

### Local User Model

We will store:

```prisma
model User {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  clerkUserId   String   @unique
  email         String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  memberships   OrganisationMember[]
}
```

Clerk `userId` maps to `clerkUserId`.

---

# 4. Multi-Organisation Model

## Organisation Models

```prisma
model Organisation {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  slug      String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members   OrganisationMember[]
  domains   OrganisationDomain[]
  quizzes   Quiz[]
}

model OrganisationMember {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  organisationId  String   @db.ObjectId
  userId          String   @db.ObjectId
  role            String   // owner | admin | editor | viewer
  createdAt       DateTime @default(now())

  @@unique([organisationId, userId])
  @@index([organisationId])
}

model OrganisationDomain {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  organisationId  String   @db.ObjectId

  hostname        String   @unique
  verified        Boolean  @default(false)

  verificationType  String?
  verificationValue String?
  verifiedAt        DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([organisationId])
}
```

---

# 5. Quiz Model (Normalized Questions)

All quiz data must include `organisationId`.

```prisma
model Quiz {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  organisationId  String   @db.ObjectId

  name            String
  slug            String
  publicSlug      String   @unique

  isScored        Boolean  @default(false)
  status          String   // draft | published | archived

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  versions        QuizVersion[]

  @@unique([organisationId, slug])
  @@index([organisationId])
}
```

---

## Versioning

```prisma
model QuizVersion {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  quizId          String   @db.ObjectId
  organisationId  String   @db.ObjectId

  versionNumber   Int
  isScored        Boolean
  createdAt       DateTime @default(now())

  questions       Question[]

  @@index([organisationId])
  @@index([quizId])
}
```

---

## Question (Normalized)

```prisma
model Question {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  quizVersionId   String   @db.ObjectId
  organisationId  String   @db.ObjectId

  type            QuestionType
  label           String
  description     String?
  required        Boolean  @default(false)
  order           Int

  config          Json?    // type-specific config

  options         Option[]

  @@index([organisationId])
  @@index([quizVersionId])
}
```

---

## Option (For multiple_choice)

```prisma
model Option {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  questionId      String   @db.ObjectId
  organisationId  String   @db.ObjectId

  label           String
  value           String?
  points          Int?

  order           Int

  @@index([organisationId])
  @@index([questionId])
}
```

---

## QuestionType Enum

```prisma
enum QuestionType {
  multiple_choice
  text
  number
  date
  email
  file
  rating
  boolean
}
```

---

# 6. Submissions

```prisma
model QuizSubmission {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  quizId          String   @db.ObjectId
  quizVersionId   String   @db.ObjectId
  organisationId  String   @db.ObjectId

  answers         Json
  score           Int?

  submittedAt     DateTime @default(now())

  @@index([organisationId])
  @@index([quizId])
}
```

### Answer Shape

```ts
type Answer =
  | { questionId: string; type: "multiple_choice"; optionId: string }
  | { questionId: string; type: "text"; value: string }
  | { questionId: string; type: "number"; value: number }
  | { questionId: string; type: "date"; value: string }
  | { questionId: string; type: "email"; value: string }
  | { questionId: string; type: "boolean"; value: boolean }
  | { questionId: string; type: "rating"; value: number }
  | { questionId: string; type: "file"; value: { key: string; name: string; size: number; mime: string } };
```

---

# 7. Routing Contract

## Platform Domain (quizr.app)

Public form:

`/f/[publicSlug]`

Dashboard:

`/app/**`

---

## Custom Domains

If request host matches `OrganisationDomain.hostname`:

Public form route:

`/{slug}`

Custom domains serve **public forms only**.
Dashboard remains on platform domain only.

---

# 8. Host-Based Organisation Resolution

Middleware logic:

1. Read `host` header.
2. If host equals platform domain:
   - Normal behavior.
3. Else:
   - Lookup `OrganisationDomain` by hostname.
   - Resolve `organisationId`.
   - Attach to request context.
   - Restrict routing to public form routes only.

---

# 9. Tenant-Safe tRPC Rules

All authenticated procedures must:

- Require Clerk session.
- Resolve active organisation.
- Validate membership in `OrganisationMember`.
- Scope all Prisma queries by `organisationId`.

Never accept `organisationId` from client input.

Public submission procedures must:

- Resolve organisation from quiz/publicSlug or host.
- Never rely on authenticated session.

---

# 10. Scoring Rules

If `isScored = false`:

- Ignore `option.points`.
- Do not compute total score.

If `isScored = true`:

- Sum `option.points`.
- Store computed score in `QuizSubmission`.

Validation must enforce:

- Options with points required only when scored.

---

# 11. Migration Steps

1. Add Organisation models.
2. Add organisationId to all quiz-related tables.
3. Backfill existing records into a default Organisation.
4. Migrate auth to Clerk.
5. Remove global queries.
6. Normalize Question and Option models.
7. Implement new Answer union.
8. Implement host-based routing.
9. Add OrganisationDomain lifecycle.

---

# 12. Non-Goals (For This Phase)

- White-label dashboard
- Multi-region hosting
- Webhooks
- Advanced conditional logic
- Complex analytics

---

End of specification.

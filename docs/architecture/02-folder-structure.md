# Recommended Repository Structure

Monorepo with **npm workspaces** (`dpr-api` + `dpr-ui`).

```
mediconnect/
├── dpr-api/                    # NestJS REST API + Prisma
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/         # filters, guards, interceptors, pipes
│   │   │   ├── config/         # env validation
│   │   │   ├── health/
│   │   │   └── prisma/         # PrismaService (@prisma/client)
│   │   ├── test/
│   └── prisma/                 # schema, migrations, seed
├── dpr-ui/                     # Next.js App Router
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/
│       │   │   ├── (auth)/
│       │   │   ├── (patient)/
│       │   │   ├── (doctor)/
│       │   │   ├── (clinic)/
│       │   │   └── (admin)/
│       │   ├── components/
│       │   └── lib/            # api client, auth helpers
│       └── Dockerfile
├── docs/
│   ├── architecture/
│   ├── superpowers/
│   │   ├── specs/
│   │   └── plans/
│   └── api/
├── .github/workflows/
├── docker-compose.yml
├── package.json                # npm workspaces root
├── package-lock.json
├── .env.example
└── README.md
```

## Module Growth (NestJS `apps/api/src/`)

Phased addition: `auth`, `users`, `patients`, `doctors`, `clinics`, `availability`, `appointments`, `prescriptions`, `medical-records`, `payments`, `subscriptions`, `notifications`, `admin`, `audit`, etc.

## Frontend Route Groups (Next.js)

| Group | Purpose |
|-------|---------|
| `(public)` | Marketing, search, doctor/clinic public profiles (no PHI) |
| `(auth)` | Login, register, verify, reset password |
| `(patient)` | Patient dashboard and records |
| `(doctor)` | Doctor workspace |
| `(clinic)` | Clinic owner / staff |
| `(admin)` | Platform super admin |

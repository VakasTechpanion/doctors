# Initial REST API Design (`/api/v1`)

OpenAPI served at `/api/docs` (Swagger). All responses use a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "pageSize": 20, "total": 100 }
}
```

Errors:

```json
{
  "success": false,
  "error": { "code": "APPOINTMENT_CONFLICT", "message": "...", "details": [] }
}
```

## Phase 1 (implemented)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness |
| GET | `/health/ready` | DB + Redis readiness |

## Phase 2 — Auth & Users

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register/patient` | Patient registration |
| POST | `/auth/register/doctor` | Doctor registration (pending verification) |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |
| POST | `/auth/forgot-password` | Request reset |
| POST | `/auth/reset-password` | Reset with token |
| POST | `/auth/verify-email` | Verify email |
| GET | `/users/me` | Current user profile |

## Phase 3 — Discovery & Appointments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/specialties` | List specialties |
| GET | `/doctors` | Search doctors (public filters) |
| GET | `/doctors/:id` | Public doctor profile |
| GET | `/clinics/:id` | Public clinic profile |
| GET | `/doctors/:id/availability` | Available slots (query: date, type) |
| POST | `/appointments/reservations` | Hold slot (TTL) |
| POST | `/appointments` | Confirm booking |
| GET | `/appointments` | List (role-scoped) |
| PATCH | `/appointments/:id` | Reschedule / status transitions |
| DELETE | `/appointments/:id` | Cancel |

## Phase 4 — Clinical

| Method | Path | Description |
|--------|------|-------------|
| GET/PUT | `/patients/me/medical-profile` | Allergies, history |
| POST | `/appointments/:id/notes` | Clinical notes |
| POST | `/appointments/:id/prescriptions` | Create prescription |
| GET | `/prescriptions/:id/pdf` | Download PDF |
| POST | `/documents` | Upload (presigned flow) |

## Phase 5 — Payments & Subscriptions

| Method | Path | Description |
|--------|------|-------------|
| POST | `/payments/orders` | Create Razorpay order |
| POST | `/payments/verify` | Client callback verification |
| POST | `/webhooks/razorpay` | Webhook (raw body, signature) |
| GET | `/subscriptions/plans` | Public plans |
| POST | `/subscriptions` | Subscribe / upgrade |
| GET | `/subscriptions/me` | Current subscription |

## Phase 6 — Admin & Clinic

| Method | Path | Description |
|--------|------|-------------|
| GET/PATCH | `/admin/doctors/pending` | Verification queue |
| CRUD | `/admin/plans` | Subscription plans |
| GET | `/admin/analytics/overview` | Platform metrics (non-PHI) |
| CRUD | `/clinic/staff` | Staff management |

## Versioning

- URI versioning: `/api/v1/...`
- Breaking changes → v2; v1 maintained for deprecation window.

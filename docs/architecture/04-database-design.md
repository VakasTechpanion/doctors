# Initial PostgreSQL Database Design

Implemented in `dpr-api/prisma/schema.prisma`. Conventions:

- Primary keys: `cuid()` for most entities; human-readable codes where needed (invoice numbers generated in app).
- Timestamps: `createdAt`, `updatedAt`; soft delete via `deletedAt` where appropriate.
- Money: `Decimal` in paise (integer minor units preferred long-term—MVP uses `Int` paise columns).
- All tenant-scoped tables include `tenantId` where applicable.

## Core Identity & Access

```
User ──┬── UserRole ── Role
       ├── RefreshToken / Session
       ├── PatientProfile (1:1)
       ├── DoctorProfile (1:1)
       └── StaffProfile (optional, clinic-linked)

Permission (optional fine-grained) ── RolePermission
```

## Tenancy & Clinics

```
Tenant (clinic organization)
  ├── ClinicBranch
  ├── ClinicMembership (user + role at clinic)
  └── Subscription (clinic-level, Phase 5+)

DoctorProfile ── DoctorClinic (doctor at branch)
              └── DoctorVerification
```

## Catalog

```
Specialty
DoctorSpecialty (M2M)
Service / ConsultationType (online | in_clinic)
```

## Scheduling & Appointments

```
DoctorSchedule (dayOfWeek, start, end, branchId)
ScheduleException (leave, holiday, block)
AppointmentSlotReservation (temporary hold, expiresAt)
Appointment (status machine, patientId, doctorId, branchId, type, fee)
AppointmentStatusHistory
```

**Indexes:** `(doctorId, startsAt)`, `(branchId, startsAt)`, `(patientId, startsAt)`, unique partial index on active slot holds.

## Payments & Billing

```
PaymentOrder (provider, amountPaise, purpose: appointment|subscription)
PaymentAttempt
Refund
PlatformCommission
Settlement (doctor/clinic payout batch)
Invoice / Receipt
IdempotencyKey
SubscriptionPlan ── PlanEntitlement
Subscription (doctor or tenant)
```

## Clinical (PHI)

```
MedicalRecord (patientId, type, visibility)
Allergy
ClinicalNote (appointment-linked, draft|final)
Diagnosis
Prescription ── PrescriptionItem
DocumentAttachment (storageKey, not public URL)
ConsentRecord
RecordAuditLog
```

## Engagement

```
Review (verified appointment only)
Notification (channel, template, status)
SupportTicket
AuditLog (admin/security events)
```

## Key Relationships

- Appointment requires valid `PatientProfile`, verified `DoctorProfile`, and `ClinicBranch`.
- Clinical notes/prescriptions reference `Appointment` when created during visit.
- PaymentOrder links to `Appointment` or `Subscription` via polymorphic `referenceType` + `referenceId`.

## State: Appointment Status

`PENDING` → `CONFIRMED` → `CHECKED_IN` → `IN_PROGRESS` → `COMPLETED`  
Branches: `CANCELLED`, `NO_SHOW`, `PAYMENT_FAILED` (from pending payment flow)

Validated only in `AppointmentsService` (Phase 3).

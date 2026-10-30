# MVP Scope & Deferred Features

## MVP (Phases 1–5 target for first usable product)

**Goal:** Patients can discover verified doctors, book in-clinic or online slots with payment, and access basic records; doctors manage schedule and appointments; platform collects subscription + commission.

### In MVP

| Area | MVP capability |
|------|----------------|
| Auth | Email/password, verification tokens, refresh sessions, RBAC |
| Profiles | Patient, doctor (pending verification), clinic registration |
| Discovery | Search/filter doctors (specialty, city, fee, type); public doctor profile (no PHI) |
| Scheduling | Weekly availability, exceptions, slot generation, transactional booking |
| Appointments | Lifecycle statuses, cancel/reschedule rules, reminders (email) |
| Payments | Razorpay orders, webhook verify, appointment pay + receipts |
| Subscriptions | Doctor trial + paid tiers, entitlements enforced on API |
| Clinical (basic) | Visit notes, allergies list, simple prescription PDF |
| Admin | Doctor verification, plan CRUD, commission config, read-only analytics skeleton |
| Ops | Docker dev stack, health checks, CI lint/build |

### Post-MVP (Phases 6–8)

- Full clinic staff RBAC, multi-branch ops, receptionist workflows
- Settlements/payouts automation, advanced MRR dashboards
- SMS/WhatsApp, video consultations (Daily.co / 100ms adapter)
- Secure document vault with signed URLs, lab reports workflow
- Reviews, messaging, follow-up requests
- Support tickets, audit UI, break-glass PHI access
- Comprehensive test suite, penetration hardening, production runbooks

### Explicitly Out of Scope (until clinician-supervised design)

- AI diagnosis or autonomous prescribing
- Call recording by default
- Public URLs for medical documents

## Phase Mapping (from product spec)

1. **Foundation** — repo, DB, API shell, web shell, Docker, seeds
2. **Auth & RBAC** — all role flows
3. **Discovery & booking** — engine + notifications
4. **Dashboards & clinical** — prescriptions, records
5. **Monetization** — Razorpay, subscriptions, commission
6. **Clinic & admin** — staff, verification, reports
7. **Advanced** — video, SMS, jobs
8. **Production** — tests, perf, deploy docs

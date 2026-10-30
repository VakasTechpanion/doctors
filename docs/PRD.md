# MediConnect Product Requirements Document (Summary)

Full detail lives in the user specification and `docs/architecture/`. This document captures product intent for engineering alignment.

## Problem

Patients struggle to find trustworthy doctors and manage appointments, records, and payments in one place. Doctors and clinics lack affordable software for scheduling, billing, and online consults without enterprise EMR cost.

## Solution

A multi-tenant SaaS platform: patient-facing discovery and booking, doctor workspace, clinic operations, and platform admin—with subscriptions and transparent booking fees.

## Personas

1. **Patient** — books care, pays, views prescriptions
2. **Doctor** — schedule, consult, prescribe, earn
3. **Clinic owner** — staff, branches, revenue
4. **Receptionist** — appointments and check-in (Phase 6)
5. **Platform admin** — verification, plans, support (non-PHI by default)

## Success Metrics (post-launch)

- Doctor paid conversion from trial
- Monthly active appointments per doctor
- Payment success rate and webhook reconciliation accuracy
- NPS from doctors on scheduling reliability

## Non-Goals (MVP)

- Full hospital EMR, insurance TPA integration, AI diagnosis
- Native mobile apps (responsive web first)

See `docs/architecture/03-mvp-and-phases.md` for MVP vs deferred features.

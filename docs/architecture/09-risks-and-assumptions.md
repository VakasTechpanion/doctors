# Risks, Dependencies & Business Assumptions

## Business Assumptions

- Initial GTM: individual doctors and small clinics in India paying monthly SaaS fees.
- Appointment commission is optional and configurable per clinic/plan.
- Doctors complete manual verification before appearing in search.
- Patients pay consultation fees online for a subset of bookings (in-clinic cash still supported).

## Technical Dependencies

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Razorpay | KYC, test vs live keys | Abstraction + sandbox; webhook idempotency |
| PostgreSQL | Connection pool exhaustion | PgBouncer in prod; Prisma pool limits |
| Redis | Single point of failure | Managed Redis; degrade rate limit if down (ready check fails) |
| Email deliverability | OTP/reset failures | Retry queue; multiple providers |
| Video SDK | Cost & compliance | Adapter pattern; no recording MVP |

## Security & Compliance Risks

- **PHI exposure via admin tools** — Mitigate with least-privilege admin APIs and audit logs.
- **Double booking** — DB constraints + transactional slot reservation (Phase 3).
- **Webhook replay** — Signature verification + idempotency store.
- **Legal** — Telemedicine, e-prescription, and data localization may impose constraints; document open questions for counsel.

## Open Legal / Regulatory Questions (require professional review)

1. Storage and processing of health data under DPDP and applicable SPDI rules.
2. State-specific telemedicine practice guidelines for online consultations.
3. E-prescription format and retention periods for Indian medical councils.
4. Cross-border data transfer if hosting outside India.

## Engineering Risks

- Large schema upfront — Prisma migrations must stay incremental; avoid breaking prod.
- Monorepo complexity — Keep packages minimal (`database` only until shared types needed).

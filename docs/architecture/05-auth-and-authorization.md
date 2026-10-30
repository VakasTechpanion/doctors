# Authentication & Authorization Strategy

## Authentication (Phase 2 implementation; foundation in Phase 1)

| Concern | Approach |
|---------|----------|
| Password storage | **Argon2id** via `argon2` package |
| Access token | JWT, short-lived (15m), signed with `JWT_ACCESS_SECRET` |
| Refresh token | Opaque random token, hashed at rest, rotation on use |
| Transport | Refresh token in **HttpOnly, Secure, SameSite=Lax** cookie; access token in memory (web) or Authorization header |
| Verification | Email OTP/link tokens (hashed); phone OTP adapter later |
| Sessions | `RefreshToken` table: userId, tokenHash, expiresAt, revokedAt, userAgent, ip |

### Flows

1. **Register** — Create user + role-specific profile stub; send verification email job.
2. **Login** — Validate credentials, issue access JWT + refresh cookie, audit log success/failure.
3. **Refresh** — Validate cookie, rotate refresh, new access JWT.
4. **Logout** — Revoke refresh token family.
5. **Password reset** — Time-limited hashed token; invalidate sessions on success.

## Authorization

### Layers

1. **Global guards** — JWT auth guard on protected routes.
2. **Role guard** — `@Roles('DOCTOR')` from JWT claims (roles loaded at login, refreshed on role change).
3. **Policy guard / service checks** — Resource ownership:
   - Patient: `patientId === auth.user.patientProfileId`
   - Doctor: appointment.doctorId or explicit care relationship
   - Clinic staff: `tenantId` + permission bitmask
   - Admin: metadata endpoints only; PHI endpoints require separate permission `ADMIN_PHI` (disabled by default)

### JWT Claims (minimal)

```json
{
  "sub": "userId",
  "roles": ["PATIENT"],
  "tenantIds": ["..."],
  "sessionId": "..."
}
```

### Multi-role users

- `UserRole` table allows multiple roles; active context selected in UI (`X-Active-Role` header) validated against assigned roles.

## Tenant Isolation

- Every clinic-scoped query includes `WHERE tenantId IN (:authorizedTenants)`.
- Prisma middleware or repository base class enforces tenant filter (Phase 2).
- Platform admins use separate controllers under `/api/v1/admin/*` without automatic PHI joins.

## Security Controls (cross-cutting)

- Rate limiting (Redis): login, OTP, password reset
- CORS: allow web origin only
- CSRF: double-submit cookie for cookie-based refresh in browser
- Input validation: DTOs + class-validator globally

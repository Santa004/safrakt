# Test Credentials — Mantorpskliniken

## Backend
- URL (preview): https://b374c590-4ff9-4af7-aa1a-866d9561bd13.preview.emergentagent.com
- URL (local):   http://localhost:8001
- Health: GET /api/health

## Auth endpoints (JWT Bearer)
- POST /api/auth/register  { name, phone, email, password }
- POST /api/auth/login     { email, password }  →  { token, user }
- GET  /api/auth/me         Authorization: Bearer <token>
- POST /api/auth/forgot-password { email }         → 200 (link written to backend logs)
- POST /api/auth/reset-password  { token, password } → 200
- POST /api/users/me/push-token  { token, platform }
- POST /api/reminders/run  (staff only, manuell trigger)

## Seed accounts (auto-created)

### Owner
- Email:    anna@test.se
- Password: Test1234
- Pets: Luna (hund, labrador, vaccination-log med nextDueDate 2027-06-26) + Måns (katt, huskatt, requested Tandvård-bokning)

### Staff
- Email:    staff@mantorpssmadjursklinik.se
- Password: Staff1234

### Extra user (skapas endast om du kör testflödet manuellt)
- bertil@test.se / Test1234  — inbjuden som samägare på Luna

## Password reset (MOCKED — email disabled)
Backend loggar reset-URL till `/var/log/supervisor/backend.err.log`:
```
grep -A2 "PASSWORD RESET" /var/log/supervisor/backend.err.log | tail -4
```
Format:
```
mantorpskliniken://reset?token=<64-char-token>
```
Kopiera token, klistra in på /auth/glomt.

## Push notifications
- Fungerar bara på native (iOS/Android via `expo start`). Web = no-op.
- Backend-schemaläggning: dagligen, notiser skickas exakt `REMINDER_DAYS_BEFORE=28` dagar före `nextDueDate`.
- Manuell test-trigger: `POST /api/reminders/run` med staff-token.

## Frontend routes
- /              Hem (public)
- /tandvard      Tandvård
- /tjanster      Tjänster
- /priser        Priser (search)
- /djur          Mina djur (login-krävs)
- /djur/lagg-till  Wizard
- /djur/[id]     Pet-profil (foto, dela-knapp)
- /djur/[id]/boka
- /djur/[id]/logga
- /djur/[id]/redigera
- /djur/[id]/dela          Familjedelning
- /auth/logga-in
- /auth/skapa-konto
- /auth/glomt              Två-stegs lösenordsåterställning
- /staff, /staff/inbox, /staff/djur   (staff only)
- /mer, /mer/om-oss, /mer/team, /mer/kontakt, /mer/hitta-hit, /mer/integritet

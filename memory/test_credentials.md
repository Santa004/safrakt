# Test Credentials — Mantorpskliniken

## Backend
- URL (preview): https://b374c590-4ff9-4af7-aa1a-866d9561bd13.preview.emergentagent.com
- URL (local): http://localhost:8001
- Health: GET /api/health

## Auth endpoints (JWT Bearer, no cookies)
- POST /api/auth/register  { name, phone, email, password }
- POST /api/auth/login     { email, password }  →  { token, user }
- GET  /api/auth/me         header: Authorization: Bearer <token>

## Seed accounts (created automatically on backend startup)

### Owner (kund/djurägare)
- Email:    anna@test.se
- Password: Test1234
- Has two pets: Luna (hund, labrador, vaccination-log med nextDueDate 2027-06-26) och Måns (katt, huskatt, med en requested Tandvård-bokning ~2 veckor framåt)

### Staff (klinikpersonal)
- Email:    staff@mantorpssmadjursklinik.se
- Password: Staff1234
- Ser samtliga djur och bokningar

## Frontend routes
- /              Hem
- /tandvard      Tandvård
- /tjanster      Tjänster
- /priser        Priser (med sökfilter)
- /djur          Mina djur (garage) — kräver login
- /djur/lagg-till  Lägg till djur-wizard
- /djur/[id]     Pet-profil (logg, next-due, boka, logga)
- /mer           Mer (klinikinfo, konto)
- /auth/logga-in
- /auth/skapa-konto
- /staff         Klinikläge (endast staff)
- /staff/inbox
- /staff/djur

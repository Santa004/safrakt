# Auth testing quick reference

## MongoDB verification
```
mongosh
use mantorpskliniken
db.users.find({}, {password_hash: 1, role: 1, email: 1}).pretty()
```
- bcrypt hash should start with `$2b$`
- unique index on `email`

## API tests
```bash
API=http://localhost:8001

# Login owner
TOKEN=$(curl -s -X POST $API/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"anna@test.se","password":"Test1234"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Me
curl -s $API/api/auth/me -H "Authorization: Bearer $TOKEN"

# Pets
curl -s $API/api/pets -H "Authorization: Bearer $TOKEN"

# Register
curl -s -X POST $API/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Ny","phone":"070","email":"ny@x.se","password":"Test1234"}'

# Wrong password → 401 with detail "Fel e-post eller lösenord"
curl -s -X POST $API/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"anna@test.se","password":"nope"}'
```

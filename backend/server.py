"""
Mantorpskliniken API — auth, pets, bookings, logs.
Bearer JWT for mobile clients (AsyncStorage). No cookies.
"""
from dotenv import load_dotenv
load_dotenv()

import os
import bcrypt
import jwt
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field, field_validator
from motor.motor_asyncio import AsyncIOMotorClient

# ---------- CONFIG ----------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_EXPIRE_HOURS = int(os.environ.get("JWT_EXPIRE_HOURS", "168"))
JWT_ALGORITHM = "HS256"

client: Optional[AsyncIOMotorClient] = None
db = None


# ---------- UTIL ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


def clean_user(u: dict) -> dict:
    return {
        "id": u["_id"],
        "name": u["name"],
        "email": u["email"],
        "phone": u.get("phone", ""),
        "role": u["role"],
        "createdAt": u["createdAt"],
    }


# ---------- AUTH ----------
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Ej inloggad")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=401, detail="Användaren hittades inte")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessionen har gått ut")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ogiltig token")


async def require_staff(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "staff":
        raise HTTPException(status_code=403, detail="Endast klinikpersonal")
    return user


# ---------- MODELS ----------
class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=3, max_length=40)
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class PetIn(BaseModel):
    species: Literal["hund", "katt", "kanin", "hast", "annat"]
    name: str = Field(min_length=1, max_length=60)
    breed: Optional[str] = ""
    sex: Literal["hane", "hona", "okant"] = "okant"
    birthDate: Optional[str] = None  # ISO YYYY-MM-DD
    chip: Optional[str] = ""
    color: Optional[str] = ""
    notes: Optional[str] = ""


class PetPatch(BaseModel):
    name: Optional[str] = None
    breed: Optional[str] = None
    sex: Optional[Literal["hane", "hona", "okant"]] = None
    birthDate: Optional[str] = None
    chip: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None
    archived: Optional[bool] = None


class BookingIn(BaseModel):
    reason: str
    preferredDate: str  # ISO date
    timeOfDay: Literal["formiddag", "eftermiddag", "kvall"]
    message: Optional[str] = ""


class BookingPatch(BaseModel):
    status: Optional[Literal["requested", "confirmed", "done", "cancelled"]] = None
    confirmedAt: Optional[str] = None
    staffNote: Optional[str] = None


class LogIn(BaseModel):
    type: str
    title: Optional[str] = None
    date: Optional[str] = None  # ISO
    notes: Optional[str] = ""
    nextDueDate: Optional[str] = None  # ISO date


# ---------- LIFESPAN + SEED ----------
NEXT_DUE_MONTHS = {
    "vaccination": 12,
    "rabies": 12,
    "tandvard": 12,
    "munsanering": 12,
    "halsokoll": 12,
}


def add_months_iso(iso_date: str, months: int) -> str:
    d = datetime.fromisoformat(iso_date.replace("Z", "")).date() if "T" in iso_date else datetime.fromisoformat(iso_date).date()
    y = d.year + (d.month - 1 + months) // 12
    m = (d.month - 1 + months) % 12 + 1
    from calendar import monthrange
    day = min(d.day, monthrange(y, m)[1])
    return datetime(y, m, day).date().isoformat()


def auto_next_due(log_type: str, date_iso: str, birth_iso: Optional[str] = None) -> Optional[str]:
    t = (log_type or "").lower().strip()
    if t == "vaccination" and birth_iso:
        try:
            b = datetime.fromisoformat(birth_iso).date()
            d = datetime.fromisoformat(date_iso).date()
            weeks = (d - b).days / 7
            if weeks < 16:
                return (d + timedelta(days=28)).isoformat()
        except Exception:
            pass
    months = NEXT_DUE_MONTHS.get(t)
    if not months:
        return None
    return add_months_iso(date_iso, months)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    await db.users.create_index("email", unique=True)
    await db.pets.create_index("ownerId")
    await db.bookings.create_index("petId")
    await db.bookings.create_index("status")
    await db.logs.create_index("petId")

    # Seed staff
    staff_email = os.environ["SEED_STAFF_EMAIL"].lower()
    existing_staff = await db.users.find_one({"email": staff_email})
    if not existing_staff:
        await db.users.insert_one({
            "_id": new_id(),
            "email": staff_email,
            "password_hash": hash_password(os.environ["SEED_STAFF_PASSWORD"]),
            "name": "Mantorpskliniken",
            "phone": "0142661980",
            "role": "staff",
            "createdAt": now_iso(),
        })
    else:
        # keep pwd in sync
        if not verify_password(os.environ["SEED_STAFF_PASSWORD"], existing_staff["password_hash"]):
            await db.users.update_one(
                {"_id": existing_staff["_id"]},
                {"$set": {"password_hash": hash_password(os.environ["SEED_STAFF_PASSWORD"])}},
            )

    # Seed owner + pets
    owner_email = os.environ["SEED_OWNER_EMAIL"].lower()
    owner = await db.users.find_one({"email": owner_email})
    if not owner:
        owner_id = new_id()
        await db.users.insert_one({
            "_id": owner_id,
            "email": owner_email,
            "password_hash": hash_password(os.environ["SEED_OWNER_PASSWORD"]),
            "name": "Anna Testsson",
            "phone": "070-123 45 67",
            "role": "owner",
            "createdAt": now_iso(),
        })
        # Luna
        luna_id = new_id()
        await db.pets.insert_one({
            "_id": luna_id, "ownerId": owner_id, "species": "hund", "name": "Luna",
            "breed": "Labrador", "sex": "hona", "birthDate": "2022-03-10",
            "chip": "752098765432109", "color": "Svart", "notes": "",
            "archived": False, "createdAt": now_iso(),
        })
        await db.logs.insert_one({
            "_id": new_id(), "petId": luna_id, "ownerId": owner_id,
            "type": "vaccination", "title": "Vaccination",
            "date": "2026-06-26", "notes": "Årlig vaccination.",
            "nextDueDate": "2027-06-26", "source": "staff", "createdAt": now_iso(),
        })
        await db.logs.insert_one({
            "_id": new_id(), "petId": luna_id, "ownerId": owner_id,
            "type": "system", "title": "Luna tillagd",
            "date": now_iso(), "notes": "Djuret lades till i appen.",
            "nextDueDate": None, "source": "system", "createdAt": now_iso(),
        })
        # Måns
        mans_id = new_id()
        await db.pets.insert_one({
            "_id": mans_id, "ownerId": owner_id, "species": "katt", "name": "Måns",
            "breed": "Huskatt", "sex": "hane", "birthDate": "2020-08-01",
            "chip": "", "color": "Grå", "notes": "",
            "archived": False, "createdAt": now_iso(),
        })
        pref = (datetime.now(timezone.utc).date() + timedelta(days=14)).isoformat()
        booking_id = new_id()
        await db.bookings.insert_one({
            "_id": booking_id, "petId": mans_id, "ownerId": owner_id,
            "reason": "Tandvård", "preferredDate": pref, "timeOfDay": "formiddag",
            "message": "Tandsten på baksidan.", "status": "requested",
            "confirmedAt": None, "createdAt": now_iso(),
        })
        await db.logs.insert_one({
            "_id": new_id(), "petId": mans_id, "ownerId": owner_id,
            "type": "system", "title": "Måns tillagd",
            "date": now_iso(), "notes": "", "nextDueDate": None,
            "source": "system", "createdAt": now_iso(),
        })
        await db.logs.insert_one({
            "_id": new_id(), "petId": mans_id, "ownerId": owner_id,
            "type": "system", "title": "Tid önskad: Tandvård",
            "date": now_iso(), "notes": f"Önskat datum {pref} (förmiddag).",
            "nextDueDate": None, "source": "owner", "bookingId": booking_id,
            "createdAt": now_iso(),
        })

    yield
    if client:
        client.close()


app = FastAPI(lifespan=lifespan, title="Mantorpskliniken API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- ROUTES ----------
@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/auth/register", status_code=201)
async def register(payload: RegisterIn):
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="E-posten är redan registrerad")
    user_id = new_id()
    doc = {
        "_id": user_id,
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": payload.name.strip(),
        "phone": payload.phone.strip(),
        "role": "owner",
        "createdAt": now_iso(),
    }
    await db.users.insert_one(doc)
    token = create_token(user_id, "owner")
    return {"token": token, "user": clean_user(doc)}


@app.post("/api/auth/login")
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Fel e-post eller lösenord")
    token = create_token(user["_id"], user["role"])
    return {"token": token, "user": clean_user(user)}


@app.get("/api/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"user": clean_user(user)}


# ---------- PETS ----------
def clean_pet(p: dict) -> dict:
    return {
        "id": p["_id"],
        "ownerId": p["ownerId"],
        "species": p["species"],
        "name": p["name"],
        "breed": p.get("breed", ""),
        "sex": p.get("sex", "okant"),
        "birthDate": p.get("birthDate"),
        "chip": p.get("chip", ""),
        "color": p.get("color", ""),
        "notes": p.get("notes", ""),
        "archived": p.get("archived", False),
        "createdAt": p.get("createdAt"),
    }


@app.get("/api/pets")
async def list_pets(user: dict = Depends(get_current_user)):
    cursor = db.pets.find({"ownerId": user["_id"], "archived": {"$ne": True}}).sort("createdAt", 1)
    pets = [clean_pet(p) async for p in cursor]
    return {"pets": pets}


@app.post("/api/pets", status_code=201)
async def create_pet(payload: PetIn, user: dict = Depends(get_current_user)):
    pet_id = new_id()
    doc = {
        "_id": pet_id,
        "ownerId": user["_id"],
        "species": payload.species,
        "name": payload.name.strip(),
        "breed": (payload.breed or "").strip(),
        "sex": payload.sex,
        "birthDate": payload.birthDate,
        "chip": (payload.chip or "").strip(),
        "color": (payload.color or "").strip(),
        "notes": (payload.notes or "").strip(),
        "archived": False,
        "createdAt": now_iso(),
    }
    await db.pets.insert_one(doc)
    await db.logs.insert_one({
        "_id": new_id(), "petId": pet_id, "ownerId": user["_id"],
        "type": "system", "title": f"{doc['name']} tillagd",
        "date": now_iso(), "notes": "Djuret lades till i appen.",
        "nextDueDate": None, "source": "system", "createdAt": now_iso(),
    })
    return {"pet": clean_pet(doc)}


async def _get_owned_pet(pet_id: str, user: dict) -> dict:
    pet = await db.pets.find_one({"_id": pet_id})
    if not pet:
        raise HTTPException(status_code=404, detail="Djuret hittades inte")
    if user["role"] != "staff" and pet["ownerId"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Åtkomst nekad")
    return pet


@app.get("/api/pets/{pet_id}")
async def get_pet(pet_id: str, user: dict = Depends(get_current_user)):
    pet = await _get_owned_pet(pet_id, user)
    owner = await db.users.find_one({"_id": pet["ownerId"]})
    return {"pet": clean_pet(pet), "owner": clean_user(owner) if owner else None}


@app.patch("/api/pets/{pet_id}")
async def patch_pet(pet_id: str, payload: PetPatch, user: dict = Depends(get_current_user)):
    pet = await _get_owned_pet(pet_id, user)
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}
    if updates:
        await db.pets.update_one({"_id": pet_id}, {"$set": updates})
    pet2 = await db.pets.find_one({"_id": pet_id})
    return {"pet": clean_pet(pet2)}


# ---------- BOOKINGS ----------
def clean_booking(b: dict) -> dict:
    return {
        "id": b["_id"], "petId": b["petId"], "ownerId": b["ownerId"],
        "reason": b["reason"], "preferredDate": b["preferredDate"],
        "timeOfDay": b["timeOfDay"], "message": b.get("message", ""),
        "status": b["status"], "confirmedAt": b.get("confirmedAt"),
        "createdAt": b.get("createdAt"),
    }


@app.get("/api/pets/{pet_id}/bookings")
async def list_bookings(pet_id: str, user: dict = Depends(get_current_user)):
    await _get_owned_pet(pet_id, user)
    cursor = db.bookings.find({"petId": pet_id}).sort("createdAt", -1)
    items = [clean_booking(b) async for b in cursor]
    return {"bookings": items}


@app.post("/api/pets/{pet_id}/bookings", status_code=201)
async def create_booking(pet_id: str, payload: BookingIn, user: dict = Depends(get_current_user)):
    pet = await _get_owned_pet(pet_id, user)
    booking_id = new_id()
    doc = {
        "_id": booking_id, "petId": pet_id, "ownerId": pet["ownerId"],
        "reason": payload.reason.strip(), "preferredDate": payload.preferredDate,
        "timeOfDay": payload.timeOfDay, "message": (payload.message or "").strip(),
        "status": "requested", "confirmedAt": None, "createdAt": now_iso(),
    }
    await db.bookings.insert_one(doc)
    await db.logs.insert_one({
        "_id": new_id(), "petId": pet_id, "ownerId": pet["ownerId"],
        "type": "system", "title": f"Tid önskad: {doc['reason']}",
        "date": now_iso(),
        "notes": f"Önskat datum {doc['preferredDate']} ({doc['timeOfDay']}).",
        "nextDueDate": None, "source": "owner", "bookingId": booking_id,
        "createdAt": now_iso(),
    })
    return {"booking": clean_booking(doc)}


@app.patch("/api/bookings/{booking_id}")
async def patch_booking(booking_id: str, payload: BookingPatch, user: dict = Depends(get_current_user)):
    b = await db.bookings.find_one({"_id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Bokningen hittades inte")
    # Owner can only cancel own booking
    if user["role"] != "staff":
        if b["ownerId"] != user["_id"]:
            raise HTTPException(status_code=403, detail="Åtkomst nekad")
        if payload.status and payload.status != "cancelled":
            raise HTTPException(status_code=403, detail="Endast avbokning tillåts")
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}
    if updates:
        await db.bookings.update_one({"_id": booking_id}, {"$set": updates})
    b2 = await db.bookings.find_one({"_id": booking_id})

    # Log status changes
    if payload.status and payload.status != b["status"]:
        title_map = {
            "confirmed": f"Tid bekräftad: {b['reason']}",
            "done": f"Besök genomfört: {b['reason']}",
            "cancelled": f"Tid avbokad: {b['reason']}",
        }
        title = title_map.get(payload.status, f"Bokning: {payload.status}")
        await db.logs.insert_one({
            "_id": new_id(), "petId": b["petId"], "ownerId": b["ownerId"],
            "type": "system", "title": title, "date": now_iso(),
            "notes": (payload.staffNote or "").strip(), "nextDueDate": None,
            "source": "staff" if user["role"] == "staff" else "owner",
            "bookingId": booking_id, "createdAt": now_iso(),
        })
        # When done → also create a real log entry + next due
        if payload.status == "done":
            pet = await db.pets.find_one({"_id": b["petId"]})
            next_due = auto_next_due(b["reason"], now_iso()[:10], pet.get("birthDate") if pet else None)
            await db.logs.insert_one({
                "_id": new_id(), "petId": b["petId"], "ownerId": b["ownerId"],
                "type": b["reason"].lower().replace(" ", ""), "title": b["reason"],
                "date": now_iso()[:10], "notes": (payload.staffNote or "").strip(),
                "nextDueDate": next_due,
                "source": "staff" if user["role"] == "staff" else "owner",
                "bookingId": booking_id, "createdAt": now_iso(),
            })

    return {"booking": clean_booking(b2)}


# ---------- LOGS ----------
def clean_log(l: dict) -> dict:
    return {
        "id": l["_id"], "petId": l["petId"],
        "type": l["type"], "title": l.get("title") or l["type"],
        "date": l.get("date"), "notes": l.get("notes", ""),
        "nextDueDate": l.get("nextDueDate"),
        "source": l.get("source", "system"),
        "bookingId": l.get("bookingId"),
        "createdAt": l.get("createdAt"),
    }


@app.get("/api/pets/{pet_id}/logs")
async def list_logs(pet_id: str, user: dict = Depends(get_current_user)):
    await _get_owned_pet(pet_id, user)
    cursor = db.logs.find({"petId": pet_id}).sort("createdAt", -1)
    items = [clean_log(l) async for l in cursor]
    return {"logs": items}


@app.post("/api/pets/{pet_id}/logs", status_code=201)
async def create_log(pet_id: str, payload: LogIn, user: dict = Depends(get_current_user)):
    pet = await _get_owned_pet(pet_id, user)
    date_iso = (payload.date or now_iso()[:10])
    next_due = payload.nextDueDate
    if not next_due:
        next_due = auto_next_due(payload.type, date_iso, pet.get("birthDate"))
    doc = {
        "_id": new_id(), "petId": pet_id, "ownerId": pet["ownerId"],
        "type": payload.type.strip(),
        "title": (payload.title or payload.type).strip(),
        "date": date_iso, "notes": (payload.notes or "").strip(),
        "nextDueDate": next_due,
        "source": "staff" if user["role"] == "staff" else "owner",
        "createdAt": now_iso(),
    }
    await db.logs.insert_one(doc)
    return {"log": clean_log(doc)}


# ---------- STAFF ----------
@app.get("/api/staff/bookings")
async def staff_bookings(user: dict = Depends(require_staff)):
    cursor = db.bookings.find({}).sort("createdAt", -1)
    items = []
    async for b in cursor:
        pet = await db.pets.find_one({"_id": b["petId"]})
        owner = await db.users.find_one({"_id": b["ownerId"]})
        items.append({
            **clean_booking(b),
            "pet": clean_pet(pet) if pet else None,
            "owner": clean_user(owner) if owner else None,
        })
    return {"bookings": items}


@app.get("/api/staff/pets")
async def staff_pets(q: Optional[str] = None, user: dict = Depends(require_staff)):
    query = {"archived": {"$ne": True}}
    if q:
        rx = {"$regex": q, "$options": "i"}
        query["$or"] = [{"name": rx}, {"chip": rx}]
    cursor = db.pets.find(query).sort("createdAt", -1).limit(100)
    items = []
    async for p in cursor:
        owner = await db.users.find_one({"_id": p["ownerId"]})
        if q and owner and (q.lower() not in owner["name"].lower() and q.lower() not in owner["email"].lower()):
            # if q is set and doesn't hit name/chip, check owner match too
            if q.lower() in p["name"].lower() or q.lower() in (p.get("chip") or "").lower():
                pass
            else:
                # keep only if pet already matched (name/chip); this is best-effort
                pass
        items.append({**clean_pet(p), "owner": clean_user(owner) if owner else None})
    return {"pets": items}

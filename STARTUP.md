# Madhuram Provision Store — How to start (every time)

## Why things disappeared after a break

Products and categories live in **MongoDB**, not in the React code.

The homepage only shows cards when:

1. MongoDB is running  
2. Backend (`server`) is running on port 5000  
3. Database has products (seeded at least once)

If you only start the frontend, or MongoDB is stopped, the API fails and product cards look “missing”.

## Every time you resume work

### 1. MongoDB

**Local service (Windows):**
```powershell
Get-Service -Name MongoDB
# If Stopped:
Start-Service -Name MongoDB
```

**Or Atlas:** internet on + correct `MONGODB_URI` in `server/.env`

### 2. Backend (Terminal 1)

```powershell
cd path\to\madhuram-complete-project\server
npm run dev
```

Wait for: `MongoDB connected` and `Server running on port 5000`

### 3. Frontend (Terminal 2)

```powershell
cd path\to\madhuram-complete-project\client
npm run dev
```

Open: http://localhost:5173

## First time only / empty database

```powershell
cd server
npm run seed
```

Safe seed: if products already exist, it **does not delete them**.

Force full reset (wipes products):
```powershell
# Windows PowerShell
$env:FORCE_SEED=1; npm run seed
```

## Health checks

| Check | URL |
|--------|-----|
| API | http://localhost:5000/api/health |
| Products | http://localhost:5000/api/products |
| Categories | http://localhost:5000/api/categories |
| Site | http://localhost:5173 |

## If cards are missing again

1. Is backend terminal still running?  
2. Is MongoDB running?  
3. Open http://localhost:5000/api/products — do you see JSON with products?  
4. Red banner on homepage? Follow its message.  
5. Empty DB → `cd server` → `npm run seed`

Do **not** need `npm install` every day (only after deleting node_modules or first clone).

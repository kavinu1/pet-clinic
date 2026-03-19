# Pet Clinic (Firebase + Express + React)

## Folder structure

- `backend/` — Node.js (Express) API using Firebase Admin SDK
- `frontend/` — React (Vite) app (login/register + client/staff dashboards)
- `firebase/` — Example Firestore security rules

## Firestore collections

### `users/{uid}`

```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "role": "client | staff",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `pets/{petId}`

```json
{
  "petId": "string",
  "name": "string",
  "nameLower": "string",
  "species": "string",
  "breed": "string",
  "age": "number | null",
  "ownerId": "string (user uid)",
  "ownerName": "string",
  "ownerNameLower": "string",
  "vaccinationRecords": "array",
  "medicalNotes": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Backend setup (Express + Firebase Admin)

1. Create a Firebase project, enable **Authentication → Email/Password**.
2. Create a service account key JSON (Firebase Console → Project settings → Service accounts).
3. Configure env vars:
   - Edit `backend/.env`
   - Set `FIREBASE_PROJECT_ID`
   - Set `FIREBASE_WEB_API_KEY` (Firebase Console → Project settings → General → Web API Key)
   - Provide credentials via either:
     - `FIREBASE_SERVICE_ACCOUNT_JSON` (single-line full service account JSON, including `private_key` and `client_email`), or
     - `FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccountKey.json`, or
     - `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json`

Run:

```bash
cd backend
npm install
npm run start
```

Bootstrap the first staff user (recommended):

```bash
cd backend
npm run bootstrap:staff -- --name "Admin" --email admin@example.com --password "ChangeMe123!"
```

## Frontend setup (React)

The frontend talks to the backend through a same-origin `/api` prefix by default.

- Dev (`npm run dev`): Vite proxies `/api/*` → `http://localhost:4000/*`.

To point at a different backend (e.g. a hosted API), set `VITE_API_URL` at build time (it can be absolute like `https://api.example.com`).

Run:

```bash
cd frontend
npm install
npm run dev
```

## API endpoints

- `POST /register` — creates a user (clients self-register; staff requires staff auth)
- `POST /login` — returns Firebase `idToken` + user profile (role)
- `GET /users` — staff-only list of client users (owner selection)
- `POST /pets` — staff-only create pet
- `GET /pets` — role-based filtering (client: own pets; staff: all pets + optional search)
- `GET /pets/:id` — role-based access
- `PUT /pets/:id` — staff-only update pet

## Firestore security rules

Example rules are in `firebase/firestore.rules`. These assume you set a Firebase custom claim `role` (`client` or `staff`) on each user.

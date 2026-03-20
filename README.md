# 🧩 Pet Clinic – Modern Full-Stack Management

A premium, role-based pet clinic management system built with **React (+ Vite)**, **Express**, and **Firebase**. This application offers a seamless experience for both pet owners and clinic staff, featuring a vibrant, responsive UI with modern glassmorphic aesthetics.

---

## 🚀 Key Highlights

- **✨ Modern UI/UX**: Vibrant blue theme, glassmorphism, smooth animations, and responsive layouts.
- **🔐 Role-Based Access Control**: Separate workflows for **Clients** (pet owners) and **Staff** (administrators).
- **📋 Pet Management**: Track medical records, vaccination history, and pet details in real-time.
- **📍 Interactive Clinic Info**: Integrated Google Maps for clinic location and routine service details.
- **⚡ Blazing Fast**: Powered by Vite for the frontend and a lightweight Express backend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS with custom design tokens (Glassmorphism, CSS Variables)

### Backend
- **Platform**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Auth**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **SDK**: [Firebase Admin SDK](https://firebase.google.com/docs/admin)

---

## 📂 Project Structure

- `frontend/` — React application featuring login/register flows and dashboards.
- `backend/` — Node.js API with Firebase integration and server-side logic.
- `firebase/` — Firestore security rules and configuration samples.

---

## ⚙️ Backend Setup (Express + Firebase Admin)

1. **Firebase Project**: Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. **Auth & Database**: Enable **Authentication** (Email/Password) and **Cloud Firestore**.
3. **Service Account**: Generate a key JSON (Project settings → Service accounts) and save it.
4. **Environment Variables**:
   - Create `backend/.env` based on the following template:
     ```env
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_WEB_API_KEY=your-web-api-key
     # Provide credentials via one of:
     FIREBASE_SERVICE_ACCOUNT_JSON={"your": "full_json"}
     # OR FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccountKey.json
     ```

5. **Run the Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

> [!TIP]
> Bootstrap your first staff user using:
> `npm run bootstrap:staff -- --name "Admin" --email admin@example.com --password "SecurePass123!"`

---

## 💻 Frontend Setup (React + Vite)

The frontend communicates with the backend via the `/api` proxy configured in `vite.config.ts`.

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment**:
   - (Optional) Set `VITE_API_URL` if the backend is not on `localhost:4000`.

3. **Development Mode**:
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Setup (Full Stack)

For a streamlined local development experience, you can run the entire stack (Frontend + Backend) using Docker Compose.

1. **Prerequisites**: Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
2. **Environment**: Ensure `backend/.env` is configured as described in the [Backend Setup](#-backend-setup-express--firebase-admin) section.
3. **Build and Run**:
   ```bash
   docker-compose up --build
   ```

- **Frontend**: Accessible at `http://localhost:8080`.
- **Backend API**: Accessible at `http://localhost:4000`.

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public/Staff | Client registration or staff-only user creation. |
| `POST` | `/login` | Public | Returns `idToken` and user role. |
| `GET` | `/users` | Staff | List all clients (for owner selection). |
| `POST` | `/pets` | Staff | Create a new pet record. |
| `GET` | `/pets` | Client/Staff | Filtered: Clients see their pets; Staff see all + search. |
| `GET` | `/pets/:id` | Client/Staff | Specific pet details with role-based access. |
| `PUT` | `/pets/:id` | Staff | Update an existing pet record. |

---

## 🛡️ Security

Example Firestore security rules are located in `firebase/firestore.rules`. These rules assume users have a custom claim `role` (`client` or `staff`) set via the backend.

---

*Built with ❤️ for better pet care.*

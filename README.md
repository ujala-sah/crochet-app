# Crochet Studio

A full-stack **Crochet Products & Patterns Management System**. Visitors browse handmade products and written patterns. Registered users keep an account. A seeded administrator manages the catalogue through a protected dashboard.

## Features

- User registration and login with JWT
- Password hashing with bcrypt
- Role-based authorization (`user`, `admin`)
- Product catalogue, search, filters, and detail pages
- Pattern catalogue, search, filters, and detail pages
- Admin dashboard with catalogue statistics
- Full product and pattern CRUD (admin only)
- MongoDB + Mongoose persistence
- Input validation, loading states, empty states, and toasts
- Responsive handmade-inspired UI

## Technology Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Auth | JWT, bcryptjs |
| Database | MongoDB, Mongoose |
| Deploy | Vercel / Netlify (client), Render / Railway (API), MongoDB Atlas |

## Installation

You need **Node.js 18+** and **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas)).

```bash
git clone <your-repo>
cd Crochet
npm run install:all
```

Copy environment files if you are not using the included local examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` and set `MONGO_URI` and a strong `JWT_SECRET`.

### Seed sample data

This replaces users, products, and patterns, then recreates the administrator from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

```bash
npm run seed
```

### Run locally

```bash
npm run dev
```

On macOS, AirPlay often occupies port 5000, so the API defaults to **5050** locally.

- Frontend: http://localhost:5173
- API: http://localhost:5050/api/health

You can also start each side separately:

```bash
npm run dev:server
npm run dev:client
```

## Environment Variables

### Server (`server/.env`)

```env
PORT=5050
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/crochet_studio
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Admin21$$
ADMIN_NAME=Studio Administrator
```

On startup the API creates the administrator if that email does not exist. The password is hashed before it is stored. Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` before any public deployment, then restart (or re-seed) so the new credentials take effect.

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5050/api
```

In production set `VITE_API_URL` to your public API, for example `https://your-api.onrender.com/api`. Do not put the admin password in any frontend file.

## Database Setup

1. Install MongoDB Community locally, or create a free Atlas cluster.
2. Put the connection string in `MONGO_URI`.
3. Run `npm run seed` once to load sample products and patterns.

## Admin Login

Use the administrator email and password from **server environment variables**, not from the UI. The default local values live only in `server/.env` / `server/.env.example` for development. Change them for any shared or production environment.

A sample member created by the seed script (for browsing tests only):

- Email: `maya@example.com`
- Password: `MakerPass1`

## API Documentation

Base URL: `/api`

### Health

`GET /health` — service status.

### Authentication

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a member |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Bearer | Current user |

Register body: `{ name, email, password, confirmPassword }`

Login body: `{ email, password }`

Send `Authorization: Bearer <token>` on protected routes.

### Products

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/products` | Public | List (query: `name`, `category`, `productType`, `availability`, `featured`) |
| GET | `/products/search?name=` | Public | Search by name |
| GET | `/products/:id` | Public | One product |
| POST | `/products` | Admin | Create |
| PUT | `/products/:id` | Admin | Update |
| DELETE | `/products/:id` | Admin | Delete |

### Patterns

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/patterns` | Public | List (query: `name`, `category`, `difficulty`, `featured`) |
| GET | `/patterns/search?name=` | Public | Search by name |
| GET | `/patterns/:id` | Public | One pattern |
| POST | `/patterns` | Admin | Create |
| PUT | `/patterns/:id` | Admin | Update |
| DELETE | `/patterns/:id` | Admin | Delete |

### Users (admin)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/users` | Admin | All users |
| GET | `/users/stats` | Admin | Dashboard counts and recent items |

Non-admins receive **403 Forbidden** on write routes and user endpoints. Missing or invalid tokens receive **401**.

## Deployment

### Database

Create a MongoDB Atlas cluster, allow the host IPs (or `0.0.0.0/0` for a demo), and copy the URI.

### Backend (Render)

1. Create a Web Service from the `server` folder.
2. Build: `npm install` — Start: `npm start`
3. Set `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend origin, comma-separated if several), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Optionally run `npm run seed` once from a one-off shell.

A `render.yaml` blueprint is included at the repo root.

### Frontend (Vercel or Netlify)

1. Set the project root to `client`.
2. Build command: `npm run build` — output: `dist`
3. Set `VITE_API_URL` to `https://<your-api-host>/api`
4. SPA rewrites are already configured (`vercel.json`, `netlify.toml`, `public/_redirects`).

### CORS

`CLIENT_URL` must match the deployed frontend origin. The API allows that origin in production.

## Project Structure

```text
Crochet/
├── client/          React + Vite app
├── server/          Express API
├── render.yaml
├── package.json     Install + dev scripts
└── README.md
```

## License

For academic and portfolio use. Replace sample imagery URLs with your own photos for commercial use.

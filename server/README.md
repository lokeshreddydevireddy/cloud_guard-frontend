# CloudVision AI — Backend

Express + MongoDB backend that powers the CloudVision AI dashboard.

## Stack

- Node.js 20+ · Express 4
- MongoDB + Mongoose 8
- JWT access + httpOnly refresh cookies
- bcryptjs password hashing (cost 12)
- Zod input validation
- Socket.IO for realtime updates
- Nodemailer for transactional email (verification / password reset)

## Folder layout

```
server/
├─ src/
│  ├─ config/       env loading + Mongo connect
│  ├─ controllers/  auth logic
│  ├─ middleware/   auth, roles, error handling
│  ├─ models/       Mongoose schemas (User, Server, Alert, Log, Notification)
│  ├─ routes/       Express routers mounted under /api/*
│  ├─ services/     mailer
│  ├─ socket/       Socket.IO gateway
│  ├─ jobs/         background jobs + seed script
│  ├─ utils/        JWT helpers
│  └─ index.js      entrypoint
├─ .env.example
└─ package.json
```

## Quick start

```bash
cd server
cp .env.example .env
# edit .env — set JWT_SECRET, JWT_REFRESH_SECRET, MONGODB_URI, CLIENT_URL
npm install
npm run seed   # optional: create admin@cloudvision.ai / ChangeMe123!
npm run dev    # or: npm start
```

Point the frontend at this backend by setting `VITE_API_URL` in the root
`.env` (e.g. `VITE_API_URL=http://localhost:4000`).

## Roles

| Role             | Permissions |
| ---------------- | ----------- |
| `admin`          | Full access (`*`) |
| `devops`         | Read/write servers, alerts, logs; read settings |
| `cloud_engineer` | Read/write servers; read alerts, logs, settings |
| `viewer`         | Read-only across servers, alerts, logs, settings |

The **first registered user** is automatically promoted to `admin`.

## Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification` (auth)
- `GET  /api/auth/profile` (auth)
- `PUT  /api/auth/profile` (auth)

### Resources (all require auth)
- `GET  /api/dashboard`
- `GET/POST/PUT/DELETE /api/servers[/:id]`
- `GET/POST /api/alerts`
- `GET  /api/logs?q=&level=&limit=`
- `GET  /api/notifications` · `PUT /api/notifications/:id/read`
- `GET/PUT /api/settings`

## Deployment

Works out of the box on Railway, Render, Fly, or plain Docker/Nginx. Set:

- `NODE_ENV=production`
- `CLIENT_URL=https://your-frontend-domain`
- `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- (optional) `SMTP_*` for transactional email

The refresh cookie is served with `SameSite=None; Secure` in production, so
your frontend and backend must both be served over HTTPS, and the frontend
axios client must send `withCredentials: true` (already configured in
`src/lib/api.ts`).

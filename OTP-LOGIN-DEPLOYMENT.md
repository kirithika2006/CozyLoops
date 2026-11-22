# Owner OTP login setup

## Local development

1. Copy `backend/.env.example` to `backend/.env` and fill in the existing MongoDB Atlas URI, Cloudinary credentials, a strong `JWT_SECRET`, `OWNER_EMAIL`, and SMTP provider credentials. Keep the Atlas URI pointed at the existing `Cozyloops21` database.
2. From `backend`, run `npm install` and `npm run dev`. The API waits for the Atlas connection before listening on port 5000.
3. From `frontend`, run `npm install` and `npm run dev`. Vite serves the app on port 5173 and proxies `/api` to the backend.
4. The OTP challenge collection is created on first OTP request. Existing product, category, video, comment, like, analytics, and admin collections are not migrated or reset.

An existing `Admin` document with `isAdmin: true` must be present. The public password login has been disabled. The old `/api/admin/init` route remains unavailable unless `ADMIN_INIT_SECRET` is configured and supplied in the `x-admin-init-secret` header; unset that variable after any controlled setup.

## Render backend

Use `backend` as the service root directory, `npm install` as the build command, and `npm start` as the start command. Configure the backend variables from `backend/.env.example` in Render. Set `FRONTEND_URL` to the exact deployed Vercel origin. Do not set secrets in Vercel variables. Keep the current Atlas and Cloudinary credentials in Render.

## Vercel frontend

Set `VITE_API_URL` to the Render API base URL, including `/api`, for example `https://<your-render-service>.onrender.com/api`. Redeploy the frontend after changing it. Local development keeps `VITE_API_URL=/api` and uses the Vite proxy.

## SMTP

Use an SMTP provider that supports authenticated TLS. Port 587 typically uses `SMTP_SECURE=false` (STARTTLS); port 465 uses `SMTP_SECURE=true`. For Gmail, turn on 2-Step Verification and use a Google App Password for `SMTP_PASS`, not the normal account password. Put the provider host, username, password or app password, and verified sender address in Render and the local backend environment only. OTP values are never returned by the API or written to logs.

Admin tokens continue to use the existing bearer-token flow and are stored in the browser's existing local storage session. Logging out clears that browser session; issued JWTs expire according to `JWT_EXPIRE`.

# SwiftCart Monorepo

Production-ready quick-commerce starter with:

- `client`: customer storefront in Next.js App Router
- `admin`: admin dashboard in Next.js App Router with `/admin` base path
- `server`: Express + MongoDB/Mongoose REST API with in-memory fallback for local demo mode

## File Structure

```text
.
├── admin
│   ├── src/app
│   ├── src/components
│   └── src/lib
├── client
│   ├── src/app
│   ├── src/components
│   ├── src/lib
│   └── src/store
├── server
│   ├── src/config
│   ├── src/controllers
│   ├── src/data
│   ├── src/middleware
│   ├── src/models
│   ├── src/routes
│   ├── src/services
│   └── uploads
└── package.json
```

## Features

- Customer app with location bar, sticky search, category grid, offers, trending products, product listing filters, detail page, cart drawer, sticky bottom cart bar, checkout, skeletons, error states, OTP login UI, and toast notifications
- Admin app with login, dashboard metrics, product CRUD, image upload, category CRUD, order status management, and user management
- Express APIs for auth, products, categories, cart, orders, uploads, and users
- MongoDB models via Mongoose, plus seeded in-memory demo mode if `MONGODB_URI` is not set

## Environment Setup

Create these files:

`server/.env`

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/swiftcart
CLIENT_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3001
ADMIN_EMAIL=admin@swiftcart.local
ADMIN_PASSWORD=admin123
JWT_SECRET=change-me
```

`client/.env.local`

```bash
NEXT_PUBLIC_API_URL=/api
INTERNAL_API_BASE_URL=http://127.0.0.1:4000/api
BACKEND_API_URL=http://127.0.0.1:4000/api
```

`admin/.env.local`

```bash
NEXT_PUBLIC_API_URL=/admin/api
NEXT_PUBLIC_ADMIN_BASE_PATH=/admin
BACKEND_API_URL=http://127.0.0.1:4000/api
```

## Run Locally

```bash
npm install
npm run dev
```

Apps:

- Customer: `http://localhost:3000`
- Admin: `http://localhost:3001/admin`
- API: `http://localhost:4000/api`

Local proxy behavior:

- Customer app calls its own `/api/*` routes and Next proxies them to the Express server
- Admin app calls its own `/admin/api/*` routes and Next proxies them to the Express server
- This lets you open the frontend on one localhost URL while the backend stays behind the scenes

Demo credentials:

- Admin login: `admin@swiftcart.local` / `admin123`
- Customer OTP: request any phone number, then enter `1234`

## Build

```bash
npm run build
```

The Next apps use `next build --webpack` for stable production verification in this environment.

## Auto Deploy

This repo is ready for push-to-deploy hosting:

- `client` -> Vercel project with Root Directory `client`
- `admin` -> Vercel project with Root Directory `admin`
- `server` -> Render web service using [render.yaml](/Users/shivamdixit/Documents/New%20project/render.yaml)
- `.github/workflows/ci.yml` runs lint and build checks on every push and pull request

### Vercel

Create two Vercel projects from the same GitHub repo.

Customer project:

- Root Directory: `client`
- Environment Variable: `NEXT_PUBLIC_API_URL=https://your-api-domain/api`

Admin project:

- Root Directory: `admin`
- Environment Variables:
  - `NEXT_PUBLIC_API_URL=https://your-api-domain/api`
  - `NEXT_PUBLIC_ADMIN_BASE_PATH=/admin`

### Render

You can deploy the API with Render Blueprint support directly from the repo using [render.yaml](/Users/shivamdixit/Documents/New%20project/render.yaml).

Required Render environment values:

- `MONGODB_URI`
- `CLIENT_ORIGIN`
- `ADMIN_ORIGIN`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

### GitHub Actions

The CI workflow is at [.github/workflows/ci.yml](/Users/shivamdixit/Documents/New%20project/.github/workflows/ci.yml). It will:

- install dependencies
- lint `client` and `admin`
- build `client` and `admin`
- syntax-check the Express server

## API Summary

- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/admin/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/cart/:sessionId`
- `POST /api/cart/:sessionId/items`
- `PATCH /api/cart/:sessionId/items/:productId`
- `DELETE /api/cart/:sessionId/items/:productId`
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/users`
- `POST /api/uploads`

## Notes

- If MongoDB is unavailable, the API falls back to seeded in-memory data so the UI still runs end to end.
- Product image uploads are stored in `server/uploads`.
- The admin app uses a `/admin` base path, so all admin routes are prefixed automatically.

# buysellapi — Buy & Sell Marketplace REST API with Node.js, Express, MongoDB & JWT

A RESTful API backend for a buy-and-sell / token marketplace, built with **Node.js, Express, and MongoDB (Mongoose)**. It provides JWT-based authentication, resource endpoints for halls, tokens, requests, and transactions, scheduled background jobs, and a ready-made **AdminJS admin panel** for managing data without writing a separate dashboard.

Ideal as a starting point for marketplace backends, token/meal-management systems, classified-listing platforms, or any Express + MongoDB API that needs auth and an admin UI out of the box.

## Features

- **REST API endpoints** for core marketplace resources:
  - `/api/auth` — user authentication (JWT + bcrypt password hashing)
  - `/api/halls` — hall listings
  - `/api/tokens` and `/api/single-tokens` — token management
  - `/api/requests` — buy/sell requests
  - `/api/transactions` — transaction records
- **AdminJS admin panel** mounted at `/admin` for visual data management
- **MongoDB with Mongoose** models and a dedicated DB connection module
- **Scheduled cron jobs** (`node-cron`) for recurring background tasks
- **CORS enabled** and JSON body parsing via Express middleware
- **Serverless-ready** — the Express app is exported from `app.js` for serverless deployment

## Tech Stack

- Node.js + Express 4
- MongoDB + Mongoose 8
- JSON Web Tokens (jsonwebtoken) + bcryptjs for auth
- AdminJS (@adminjs/express, @adminjs/mongoose)
- node-cron, dotenv, cors, body-parser

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A MongoDB database (local or MongoDB Atlas)

### Installation

```bash
git clone https://github.com/sh00von/buysellapi.git
cd buysellapi
npm install
```

Create a `.env` file in the project root with your environment values (MongoDB connection string and JWT secret — see `lib/dbConnect` and the auth routes for the variables the code expects).

The Express application is defined in `app.js`, the AdminJS panel is wired up in `admin.js`, and scheduled jobs live in `cronJobs.js`. Mount or run `app.js` with your preferred Node/serverless runtime.

## Usage

Once running, typical API calls look like:

```bash
# Authenticate
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"your-password"}'

# List halls
curl http://localhost:5000/api/halls -H "Authorization: Bearer <token>"
```

The admin panel is available at `/admin` on the same host.

---

⭐ If this marketplace API boilerplate saves you time, please star the repo. Issues, suggestions, and pull requests are welcome!

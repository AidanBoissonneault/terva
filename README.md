# TERVA
**15MAR2026–present · Aidan Boissonneault**

Terva is a coffee brew tracking app. Log brews, manage bean and gear data, and use past sessions as a confident starting point for your next cup.

---

## Stack

- **Client** — Vue 3, TypeScript, Vite
- **Server** — Node.js, Express v5
- **Database** — MySQL 8.0+
- **Auth** — BetterAuth (email/password, cookie-based sessions)

---

## Installation

```bash
npm install
```

Dependencies are hoisted via the monorepo root. If you need to install per-package:

```bash
cd packages/client && npm install
cd packages/server && npm install
```

---

## Development

```bash
# from root
npm run dev
```

Runs client (Vite) and server (Express) concurrently.

---

## Database Setup

Requires MySQL 8.0+ running locally.

### 1. Create the database and tables

```bash
mysql -u root -p < db/schema.sql
```

### 2. Run the BetterAuth migration

BetterAuth manages its own tables (`user`, `session`, `account`, `verification`) separately from the app schema. After the schema is created, run:

```bash
cd packages/server
npx better-auth migrate
```

### 3. (Optional) Seed with sample data

```bash
mysql -u root -p < db/seed.sql
```

Populates the database with sample beans, recipes, gear, and brew logs for immediate use during development.

### Resetting the database

```bash
mysql -u root -p < db/schema.sql
npx better-auth migrate          # re-run from packages/server
mysql -u root -p < db/seed.sql  # optional
```

`schema.sql` drops and recreates app tables from scratch. BetterAuth tables are separate and managed by its own migration.

---

## Environment

Copy the example env and fill in your credentials:

```bash
cp .env.example .env
```

### `packages/server/.env`

```env
BETTER_AUTH_SECRET=        # openssl rand -base64 32 (min 32 chars)
BETTER_AUTH_URL=http://localhost:3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=terva
```

### `packages/client/.env`

```env
VITE_API_URL=http://localhost:3000
```
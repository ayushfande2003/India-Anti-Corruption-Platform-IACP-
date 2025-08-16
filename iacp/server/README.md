# IACP Server

- Node.js + Express
- PostgreSQL + Prisma

## Setup

1. Create `.env` from provided defaults and set `DATABASE_URL`.
2. Install deps and run migrations:

```
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
```

3. Start dev server:
```
npm run dev
```
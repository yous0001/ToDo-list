## Overview

This workspace now contains two coordinated apps:

| Path | Description |
| --- | --- |
| `server/` | Express + TypeScript API backed by MongoDB for persistent tasks. |
| `next-todo/` | Next.js front-end that consumes the API and provides the timer UI. |

## Requirements

- Node.js 18+
- npm (ships with Node)

## Environment

- **Backend:** copy `server/env.sample` to `server/.env` and update the Mongo URI, DB name, optional `CORS_ORIGIN`, and port.
- **Frontend:** copy `next-todo/env.sample` to `next-todo/.env.local` and set `NEXT_PUBLIC_API_URL` to wherever the backend runs.

```bash
cd server
cp env.sample .env

cd ../next-todo
cp env.sample .env.local
```

## Development

Run the API (defaults to port `4000`):

```
cd server
npm install
npm run dev
```

Run the Next.js app (defaults to port `3000`):

```
cd next-todo
npm install
npm run dev
```

Visit `http://localhost:3000` to use the tracker. The UI automatically syncs every task action with the backend.

## Production builds

```
cd server
npm install
npm run start

cd next-todo
npm install
npm run build
npm run start
```

Serve both apps behind the same domain (or configure CORS/Reverse proxy).

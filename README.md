# MockForge

Paste JSON, get a live REST API.

MockForge turns a JSON object into a workspace with working CRUD endpoints, a data viewer, and options to simulate slow or failing responses. Frontend developers can build and test against an API before a real backend exists.

**Live demo:** https://mock-forge-one.vercel.app/

<!--
Add screenshots to a docs/ folder, then uncomment:
![Creating a workspace](docs/home.png)
![Workspace viewer](docs/viewer.png)
-->

## Features

- **Instant endpoints:** paste a JSON object and get a unique workspace with REST endpoints for every resource in it.
- **Full CRUD:** `GET`, `POST`, `PUT` and `DELETE` work on every resource, backed by MongoDB.
- **Filter, sort and paginate** the list endpoints with simple URL options.
- **Simulate slow and failing responses** with `?_delay` and `?_status`, to test loading and error screens.
- **Workspace viewer:** browse each resource as a table and delete records from the browser.
- **Open to any frontend:** CORS is enabled on the API, so you can call it from any website or local dev server.
- **Rate limited** per visitor, with a stricter limit on creating workspaces.

## Quick start

**1. Create a workspace.** Send a JSON object where each key is a resource name and each value is an array of records:

```json
{
  "products": [
    { "name": "Running Shoe", "price": 2499, "inStock": true },
    { "name": "Backpack", "price": 1299, "inStock": false }
  ],
  "users": [
    { "name": "Asha", "email": "asha@example.com" }
  ]
}
```

Paste it on the home page and click **Create API**, or send it yourself:

```bash
curl -X POST https://mock-forge-one.vercel.app/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{"products":[{"name":"Running Shoe","price":2499}]}'
```

The response contains your workspace ID and one URL per resource:

```json
{
  "workspaceId": "a3f9c21b",
  "endpoints": ["/api/mock/a3f9c21b/products"]
}
```

**2. Call your endpoints.**

```javascript
const base = "https://mock-forge-one.vercel.app/api/mock/a3f9c21b";

// list
const products = await fetch(`${base}/products`).then((r) => r.json());

// create
await fetch(`${base}/products`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Cap", price: 399 }),
});
```

**3. View your data** at `/workspace/<workspaceId>`.

## API reference

| Method | Path | What it does |
|---|---|---|
| `POST` | `/api/workspaces` | Create a workspace from a JSON object of arrays |
| `GET` | `/api/mock/:workspaceId/:resource` | List records |
| `POST` | `/api/mock/:workspaceId/:resource` | Create a record (returns `201`) |
| `GET` | `/api/mock/:workspaceId/:resource/:id` | Get one record |
| `PUT` | `/api/mock/:workspaceId/:resource/:id` | Replace a record |
| `DELETE` | `/api/mock/:workspaceId/:resource/:id` | Delete a record |

Records come back flat, with an `id` next to your own fields:

```json
{ "id": "64f1c0...", "name": "Running Shoe", "price": 2499 }
```

Errors return JSON like `{ "error": "..." }` with a matching status: `400` for invalid input or an invalid id, `404` when a record is not found, and `429` when you are sending too many requests.

### URL options

Add these to any `/api/mock/...` URL:

| Option | Example | What it does |
|---|---|---|
| Filter | `?category=shoes` | Returns records where the field matches. Strings, numbers and booleans all work, and several filters can be combined |
| Sort | `?_sort=price&_order=desc` | Sorts by a field. `_order` is `asc` by default |
| Paginate | `?_page=2&_limit=5` | Returns one page. Lists return at most 100 records per request |
| Delay | `?_delay=2000` | Waits before responding, in milliseconds (up to 5000) |
| Error | `?_status=500` | Returns that status code (400 to 599) with `{ "error": "Simulated error" }` |

Example: `/api/mock/a3f9c21b/products?category=shoes&inStock=true&_sort=price&_limit=10`

## Tech stack

- Next.js (App Router) with JavaScript
- MongoDB with Mongoose
- Upstash Redis for rate limiting
- Tailwind CSS
- Deployed on Vercel

## How it works

- **One collection, no schemas.** Every record is stored as `{ workspaceId, resource, data }`, where `data` holds the JSON you sent. Any resource name works without setup, and an index on `workspaceId` and `resource` keeps lookups fast.
- **One handler for every resource.** Dynamic routes (`/api/mock/[workspaceId]/[resource]`) serve any workspace and resource name, and a small formatter flattens each stored record into the response you see.
- **A proxy in front of the API.** `src/proxy.js` runs before the API routes. It applies per-visitor rate limits (using Upstash Redis) and handles the `_delay` and `_status` options, so the route handlers stay focused on data.
- **Serverless-friendly database connection.** The MongoDB connection is cached between requests, so each serverless instance opens it once.

## Run locally

```bash
git clone https://github.com/rupadevii/MockForge.git
cd mockforge
npm install
```

Create a `.env.local` file in the project root:

```
MONGODB_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

You need a MongoDB database (a free MongoDB Atlas cluster works) and an Upstash Redis database (the free tier works). Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
├── proxy.js                      rate limiting, delay and error options
├── app/
│   ├── page.js                   home page: create a workspace
│   ├── workspace/[workspaceId]/  workspace viewer
│   └── api/
│       ├── workspaces/           create a workspace, list its resources
│       └── mock/                 the generated CRUD endpoints
├── lib/                          database connection, rate limiters, record formatter
└── models/                       Mongoose model
```

## Limits and notes

- **This is a shared public sandbox.** Anyone with a workspace ID can read and change its data, so don't store anything private.
- List requests return at most 100 records, and `_delay` is capped at 5 seconds.
- Requests are rate limited per visitor, with a stricter limit on creating workspaces.
- A workspace exists while it has at least one record. Deleting every record removes it.
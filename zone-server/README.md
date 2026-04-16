# Zone Server — Multi-Vendor Commerce API

A **zone-based multi-vendor commerce backend** built with **Express.js** and **MongoDB**, optimized for **Vercel serverless** deployment. Covers the full commerce lifecycle: admin, operators, zones, stores, catalog, cart, wishlist, coupons, orders, payments (UPI), refunds, and delivery.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Vercel Deployment](#vercel-deployment)
- [API Docs UI](#api-docs-ui)
- [Authentication](#authentication)
- [Standard Response Format](#standard-response-format)
- [Pagination](#pagination)
- [Soft Delete & Bin Logic](#soft-delete--bin-logic)
- [Search & Filtering](#search--filtering)
- [Data Models](#data-models)
- [Modules & Routes](#modules--routes)
  - [Administrator](#administrator-module)
  - [Operator](#operator-module)
  - [Authorized Person](#authorized-person-module)
  - [Zone](#zone-module)
  - [Store Category](#store-category-module)
  - [Store](#store-module)
  - [Store User](#store-user-module)
  - [Product Category](#product-category-module)
  - [Product](#product-module)
  - [Product Variant](#product-variant-module)
  - [Cart](#cart-module)
  - [Wishlist](#wishlist-module)
  - [Coupon](#coupon-module)
  - [Coupon Usage](#coupon-usage-module)
  - [Review](#review-module)
  - [Order](#order-module)
  - [Payment](#payment-module)
  - [Refund](#refund-module)
  - [Order Delivery](#order-delivery-module)
  - [Order Status History](#order-status-history-module)
- [Validation Rules](#validation-rules)
- [Error Reference](#error-reference)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js >= 18 |
| Framework | Express.js ^4.21 |
| Database | MongoDB via Mongoose ^8.10 |
| Validation | Zod ^3.24 |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Logging | Morgan |
| Security | Helmet |
| Slug Generation | Slugify |
| Deployment | Vercel (serverless) |

---

## Project Structure

```
zone-server/
├── api/
│   └── index.js                  # Vercel serverless entry point
├── docs/
│   ├── index.html                # Interactive API docs (no Swagger)
│   └── docs.js                   # CSP-safe external JS for docs
├── src/
│   ├── app.js                    # Express app (no listen — Vercel safe)
│   ├── server.js                 # Local dev server
│   ├── config/
│   │   ├── env.js
│   │   ├── db.mongo.js
│   │   └── logger.js
│   ├── models/                   # Mongoose schemas
│   ├── dto/                      # Zod validation schemas
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── services/                 # Business logic layer
│   ├── controllers/              # HTTP request handlers
│   ├── routes/                   # Express routers
│   └── utils/
│       ├── response.js
│       ├── paginate.js
│       └── jwt.js
├── .env
├── .env.example
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or MongoDB Atlas)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/your-org/zone-server.git
cd zone-server

# Install dependencies
npm install

# Copy and fill environment variables
cp .env.example .env

# Development with hot reload
npm run dev

# Production
npm start
```

- API runs on `http://localhost:5000`
- Interactive docs at `http://localhost:5000/api-docs`

---

## Environment Variables

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/zone-db

# JWT
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d

# Administrator credentials (from ENV — not DB)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_OTP_SECRET=your_otp_secret

# External microservices
MAIL_SERVICE_URL=http://localhost:6000
AUTH_SERVICE_URL=http://localhost:4000
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | ✅ | Token expiry e.g. `7d`, `24h` |
| `ADMIN_EMAIL` | ✅ | Administrator email (from ENV, not DB) |
| `MAIL_SERVICE_URL` | ✅ prod | Required for OTP email delivery |
| `PORT` | Optional | Defaults to `5000` |

> **Important:** The administrator account is defined entirely in environment variables, not stored in any database.

---

## Vercel Deployment

This project is built for Vercel serverless deployment.

### How it works

- `api/index.js` is the single Vercel function entry point.
- MongoDB connection is **cached at module level** — warm invocations reuse the existing connection.
- `app.js` never calls `app.listen()` — Vercel handles the HTTP layer.
- All traffic is routed through `vercel.json` to `api/index.js`.

### Deploy

```bash
npm i -g vercel
vercel --prod
```

### Set environment variables on Vercel

Go to **Project → Settings → Environment Variables** and add all variables from `.env.example`.

### Vercel-specific notes

- **No Swagger UI** — Swagger relies on file system access that breaks in serverless. This project uses a self-contained `docs/index.html` instead, served from the `/api-docs` route.
- Function timeout is set to **30 seconds** in `vercel.json`. Upgrade to Pro for up to 60 seconds.
- Use **MongoDB Atlas** for production. Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/zone-db?retryWrites=true&w=majority`
- Scheduled cleanup (soft delete purge after 3 days) must be handled via **Vercel Cron Jobs** — add a cron entry to `vercel.json` pointing to a cleanup endpoint.

### Vercel Cron for soft delete cleanup

```json
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 2 * * *"
  }]
}
```

The cleanup handler permanently removes all documents where `is_deleted: true` and `deleted_at < now - 3 days`.

---

## API Docs UI

A custom interactive API reference is served at `/api-docs`.

- Single self-contained `docs/index.html` — **no Swagger, no dependencies**
- Works correctly on Vercel (no filesystem access required)
- Dark-theme, mobile-responsive
- Copy buttons on all code examples
- **Try It** panels — send live requests from the browser with token support
- Sidebar navigation with scroll-based active state
- Auth lock icons on protected routes
- Soft delete warnings on DELETE endpoints

---

## Authentication

### Protected Routes

All protected routes require a Bearer token:

```http
Authorization: Bearer <your_jwt_token>
```

### Public Routes (no auth required)

```
POST   /api/v1/administrators/login
POST   /api/v1/administrators/verify-otp
POST   /api/v1/authorize-person/login
GET    /api/v1/stores
GET    /api/v1/stores/:id
GET    /api/v1/stores/pin-code/:pin-code
GET    /api/v1/coupons/public
GET    /api/v1/coupons/code/:code
POST   /api/v1/payments/webhook
```

### Administrator Authentication

The administrator is defined in **environment variables**, not the database. Login uses a two-step **OTP flow**:

1. `POST /api/v1/administrators/login` — validates email from ENV, sends OTP to admin email
2. `POST /api/v1/administrators/verify-otp` — verifies OTP, returns JWT

### Authorized Person Authentication

`POST /api/v1/authorize-person/login` — sends OTP to registered email, returns JWT on verification.

---

## Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {},
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Request failed",
  "error": {
    "reason": "NOT_FOUND",
    "message": "No record found with the given ID"
  }
}
```

---

## Pagination

All list endpoints support pagination via query parameters.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page (max 100) |
| `sort_by` | string | `created_at` | Field to sort by |
| `sort_order` | string | `desc` | `asc` or `desc` |

### Pagination meta in response

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "total_pages": 25
  }
}
```

---

## Soft Delete & Bin Logic

`DELETE` endpoints **do not permanently remove records**.

### Fields used

| Field | Type | Description |
|---|---|---|
| `is_deleted` | Boolean | `true` when soft-deleted |
| `deleted_at` | ISO DateTime | Timestamp of deletion |
| `deleted_by` | String | ID of the user who deleted |

### Flow

1. DELETE sets `is_deleted: true`, `deleted_at: now`, `deleted_by: userId`.
2. All list and detail queries filter `is_deleted: false` automatically.
3. A **Vercel Cron Job** running daily permanently purges records older than 3 days.

### Soft delete response

```json
{
  "success": true,
  "message": "Record moved to bin successfully",
  "data": {
    "_id": "663f...",
    "is_deleted": true,
    "deleted_at": "2024-05-15T12:00:00.000Z",
    "deleted_by": "664a..."
  }
}
```

---

## Search & Filtering

| Parameter | Description |
|---|---|
| `search` | Full-text or regex search across name, email, etc. |
| `status` | Filter by status value |
| `category_id` | Filter by category |
| `operator_id` | Filter by operator |
| `store_id` | Filter by store |
| `product_id` | Filter by product |
| `role` | Filter by role |
| `pin_code` | Filter by pin code |

**Example:**

```
GET /api/v1/stores?page=1&limit=10&search=spice&status=ACTIVE&category_id=664d...
GET /api/v1/products?search=paneer&store_id=664e...&type=SIMPLE
GET /api/v1/orders?status=CONFIRMED&store_id=664e...&page=2
```

---

## Data Models

### Order

```
_id              ObjectId
order_no         String (unique, auto-generated)
customer_id      String (ref: Customer)
store_id         ObjectId (ref: Store)
items            [OrderItem]
status           Enum: PENDING | CONFIRMED | PACKED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | REFUNDED
subtotal         Number
discount         Number (default: 0)
coupon_id        String | null
delivery_charge  Number (default: 0)
tax              Number (default: 0)
total            Number
payment_status   Enum: PENDING | PAID | FAILED | REFUNDED
payment_id       String | null
delivery_id      String | null
note             String
address          { line1, line2, city, state, pin_code, country }
is_deleted       Boolean
deleted_at       Date | null
deleted_by       String | null
created_at       Date
updated_at       Date
```

**Order Status Flow:**

```
PENDING → CONFIRMED → PACKED → OUT_FOR_DELIVERY → DELIVERED
       ↘ CANCELLED
DELIVERED → REFUNDED (on refund approval)
```

### Order Item

```
_id            ObjectId
order_id       ObjectId (ref: Order)
product_id     ObjectId (ref: Product)
variant_id     ObjectId | null (ref: ProductVariant)
name           String (snapshot at order time)
sku            String (snapshot)
quantity       Number (min: 1)
unit_price     Number
total_price    Number
image_url      String | null
created_at     Date
```

### Payment

```
_id              ObjectId
order_id         ObjectId (ref: Order)
customer_id      String
amount           Number
currency         String (default: INR)
method           Enum: UPI | CASH | ONLINE
status           Enum: PENDING | SUCCESS | FAILED | REFUNDED
upi_txn_id       String | null
upi_ref_id       String | null
payment_gateway  String | null
gateway_response Object | null
paid_at          Date | null
failed_at        Date | null
created_at       Date
updated_at       Date
```

### Refund

```
_id          ObjectId
order_id     ObjectId (ref: Order)
payment_id   ObjectId (ref: Payment)
customer_id  String
amount       Number
reason       String
status       Enum: PENDING | APPROVED | REJECTED | PROCESSED
upi_id       String | null (refund destination)
txn_id       String | null
processed_at Date | null
rejected_at  Date | null
note         String
created_at   Date
updated_at   Date
```

### Order Delivery

```
_id               ObjectId
order_id          ObjectId (ref: Order)
delivery_person   String
phone             String
status            Enum: ASSIGNED | PICKED_UP | IN_TRANSIT | DELIVERED | FAILED
tracking_url      String | null
estimated_at      Date | null
delivered_at      Date | null
failed_reason     String | null
created_at        Date
updated_at        Date
```

### Order Status History

```
_id        ObjectId
order_id   ObjectId (ref: Order)
status     Enum: PENDING | CONFIRMED | PACKED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | REFUNDED
note       String
changed_by String (admin/operator ID)
created_at Date
```

### Cart

```
_id          ObjectId
customer_id  String (unique index)
store_id     ObjectId (ref: Store)
items        [CartItem]
coupon_id    String | null
subtotal     Number
discount     Number
total        Number
created_at   Date
updated_at   Date
```

### Cart Item

```
_id         ObjectId (subdocument)
product_id  ObjectId (ref: Product)
variant_id  ObjectId | null (ref: ProductVariant)
name        String
sku         String
quantity    Number (min: 1)
unit_price  Number
total_price Number
image_url   String | null
```

### Wishlist

```
_id          ObjectId
customer_id  String (index)
items        [WishlistItem]
created_at   Date
updated_at   Date
```

### Wishlist Item

```
_id         ObjectId (subdocument)
product_id  ObjectId (ref: Product)
variant_id  ObjectId | null
name        String
image_url   String | null
price       Number
added_at    Date
```

### Coupon

```
_id              ObjectId
code             String (unique, uppercase)
description      String
type             Enum: PERCENTAGE | FLAT
value            Number (% or flat amount)
min_order_value  Number (default: 0)
max_discount     Number | null (cap for PERCENTAGE coupons)
usage_limit      Number | null (total uses allowed)
usage_count      Number (default: 0)
per_user_limit   Number (default: 1)
is_active        Boolean (default: true)
valid_from       Date
valid_until      Date
store_id         String | null (null = platform-wide)
is_public        Boolean (default: false)
is_deleted       Boolean
deleted_at       Date | null
created_at       Date
updated_at       Date
```

### Coupon Usage

```
_id          ObjectId
coupon_id    ObjectId (ref: Coupon)
customer_id  String
order_id     ObjectId (ref: Order)
discount     Number (applied discount amount)
used_at      Date
```

### Review

```
_id          ObjectId
order_id     ObjectId (ref: Order)
product_id   ObjectId (ref: Product)
customer_id  String
store_id     ObjectId (ref: Store)
rating       Number (min: 1, max: 5)
comment      String
images       [String]
is_verified  Boolean (default: false)
is_deleted   Boolean
deleted_at   Date | null
created_at   Date
updated_at   Date
```

### Notification

```
_id          ObjectId
user_id      String
user_type    Enum: CUSTOMER | STORE_USER | OPERATOR | ADMIN
type         Enum: ORDER | PAYMENT | REFUND | DELIVERY | SYSTEM | PROMOTION
title        String
message      String
is_read      Boolean (default: false)
reference_id String | null (order ID, payment ID, etc.)
read_at      Date | null
created_at   Date
```

---

## Modules & Routes

**Base URL:** `/api/v1`

---

## Administrator Module

> Administrator credentials are stored in **ENV variables**, not the database. Login uses a two-step OTP flow.

### `POST /api/v1/administrators/login`

Initiates OTP login. Validates the email against `ADMIN_EMAIL` in ENV and sends an OTP to that address via the mail service.

**Request Body**

```json
{ "email": "admin@yourdomain.com" }
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "OTP sent to admin email",
  "data": {
    "email": "admin@yourdomain.com",
    "otp_expires_at": "2024-05-16T09:10:00.000Z"
  },
  "meta": {}
}
```

**Error Response** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": { "reason": "INVALID_EMAIL", "message": "This email is not registered as administrator" }
}
```

> In development without a mail service, `_dev_otp` is returned in the response body for testing.

---

### `POST /api/v1/administrators/verify-otp`

Verifies the OTP and returns a signed JWT token.

**Request Body**

```json
{ "email": "admin@yourdomain.com", "otp": "847291" }
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "email": "admin@yourdomain.com",
      "role": "ADMINISTRATOR"
    }
  },
  "meta": {}
}
```

**Error Response** `401 Unauthorized`

```json
{
  "success": false,
  "message": "OTP verification failed",
  "error": { "reason": "INVALID_OTP", "message": "OTP is incorrect or has expired" }
}
```

> OTP is valid for **10 minutes** from the time of issue.

---

## Operator Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/operators` | 🔒 | Create operator |
| GET | `/api/v1/operators` | 🔒 | List all operators |
| GET | `/api/v1/operators/:id` | 🔒 | Get operator by ID |
| PATCH | `/api/v1/operators/:id/status` | 🔒 | Toggle active status |
| PUT | `/api/v1/operators/:id` | 🔒 | Assign zone & authorized person |
| DELETE | `/api/v1/operators/:id` | 🔒 | Soft delete |

### `POST /api/v1/operators`

**Request Body**

```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone_number": "9876543210",
  "business_type": "Retail",
  "upi_id": "rajesh@upi"
}
```

**Validation:** name (min 3), email (valid), phone_number (10–15 chars), business_type (min 2), upi_id (optional).

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Operator created successfully",
  "data": {
    "_id": "663f1a4c9b0e4d001a2f8c10",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone_number": "9876543210",
    "business_type": "Retail",
    "upi_id": "rajesh@upi",
    "is_active": true,
    "is_deleted": false,
    "zone_id": null,
    "authorized_person_id": null,
    "created_by": "664a1f3b2c4e8d001f3a7c21",
    "updated_by": null,
    "created_at": "2024-05-12T09:15:00.000Z",
    "updated_at": "2024-05-12T09:15:00.000Z"
  },
  "meta": {}
}
```

**Error Response** `409 Conflict`

```json
{
  "success": false,
  "message": "Operator creation failed",
  "error": { "reason": "DUPLICATE_EMAIL", "message": "An operator with this email already exists" }
}
```

### `GET /api/v1/operators`

**Query Parameters:** `page`, `limit`, `search` (name/email), `status` (true/false)

```
GET /api/v1/operators?page=1&limit=10&search=rajesh&status=true
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Operators fetched successfully",
  "data": [
    {
      "_id": "663f1a4c9b0e4d001a2f8c10",
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "is_active": true,
      "created_at": "2024-05-12T09:15:00.000Z",
      "updated_at": "2024-05-12T09:15:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 42, "total_pages": 5 }
}
```

### `GET /api/v1/operators/:id`

Returns full operator object including `zone_id` and `authorized_person_id`.

**Error Response** `404 Not Found`

```json
{
  "success": false,
  "message": "Operator not found",
  "error": { "reason": "NOT_FOUND", "message": "No operator found with the given ID" }
}
```

### `PATCH /api/v1/operators/:id/status`

```json
{ "is_active": false }
```

### `PUT /api/v1/operators/:id`

Assign a zone and authorized person to the operator.

```json
{
  "zone_id": "664b2c5d3e0f4a002b3e9d11",
  "authorized_person_id": "664c3d6e4f1a5b003c4f0e22"
}
```

### `DELETE /api/v1/operators/:id`

Soft delete. Sets `is_deleted: true`, `deleted_at`, and `deleted_by`. Permanently purged after 3 days.

---

## Authorized Person Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/authorize-person/login` | Public | Request OTP via email |
| POST | `/api/v1/authorized-person` | 🔒 | Create authorized person |
| GET | `/api/v1/authorized-person` | 🔒 | List all |
| GET | `/api/v1/authorized-person/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/authorized-person/:id` | 🔒 | Update |
| DELETE | `/api/v1/authorized-person/:id` | 🔒 | Soft delete |
| GET | `/api/v1/authorized-person/operators/:operatorId` | 🔒 | Get by operator |

**Roles:** `MANAGER` | `STAFF` | `SUPPORT` | `DELIVERY`

### `POST /api/v1/authorize-person/login`

Sends an OTP to the authorized person's registered email. Responds with `_dev_otp` in development mode when `MAIL_SERVICE_URL` is not configured.

**Request Body**

```json
{ "email": "priya@example.com" }
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "OTP sent to your registered email address",
  "data": {
    "email": "priya@example.com",
    "otp_expires_at": "2024-05-16T09:10:00.000Z"
  },
  "meta": {}
}
```

After receiving the OTP, call `POST /api/v1/authorize-person/verify-otp` with `{ email, otp }` to receive a JWT token.

### `POST /api/v1/authorized-person`

**Request Body**

```json
{
  "name": "Priya Sharma",
  "phone_number": "9123456780",
  "email": "priya@example.com",
  "operator_id": "663f1a4c9b0e4d001a2f8c10",
  "role": "MANAGER"
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Authorized person created successfully",
  "data": {
    "_id": "664c3d6e4f1a5b003c4f0e22",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone_number": "9123456780",
    "operator_id": "663f1a4c9b0e4d001a2f8c10",
    "role": "MANAGER",
    "created_at": "2024-05-13T10:00:00.000Z",
    "updated_at": "2024-05-13T10:00:00.000Z"
  },
  "meta": {}
}
```

### `GET /api/v1/authorized-person`

**Query Parameters:** `page`, `limit`, `search` (name/email), `operator_id`, `role`

### `GET /api/v1/authorized-person/operators/:operatorId`

Returns all authorized persons linked to a specific operator. Supports `page` and `limit`.

---

## Zone Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/zones` | 🔒 | Create zone |
| GET | `/api/v1/zones` | 🔒 | List all zones |
| GET | `/api/v1/zones/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/zones/:id` | 🔒 | Update zone metadata |
| DELETE | `/api/v1/zones/:id` | 🔒 | Soft delete |
| PATCH | `/api/v1/zones/add-pin-code` | 🔒 | Add single pin code |
| PATCH | `/api/v1/zones/remove-pin-code` | 🔒 | Remove single pin code |
| PATCH | `/api/v1/zones/add-bulk-pin-code` | 🔒 | Add multiple pin codes |
| PATCH | `/api/v1/zones/remove-bulk-pin-code` | 🔒 | Remove multiple pin codes |

> **Route order note:** All `/zones/add-*` and `/zones/remove-*` PATCH routes are registered before `/:id` to prevent Express from treating them as IDs.

### `POST /api/v1/zones`

**Request Body**

```json
{
  "area": "South Kolkata",
  "zone_name": "Zone-SK-01",
  "latitude": 22.5355,
  "longitude": 88.3476,
  "operator_id": "663f1a4c9b0e4d001a2f8c10",
  "zone": [
    { "post_office": "Jadavpur", "pin_code": 700032 },
    { "post_office": "Tollygunge", "pin_code": 700033 }
  ]
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Zone created successfully",
  "data": {
    "_id": "664b2c5d3e0f4a002b3e9d11",
    "area": "South Kolkata",
    "zone_name": "Zone-SK-01",
    "latitude": 22.5355,
    "longitude": 88.3476,
    "operator_id": "663f1a4c9b0e4d001a2f8c10",
    "zone": [
      { "post_office": "Jadavpur", "pin_code": 700032 },
      { "post_office": "Tollygunge", "pin_code": 700033 }
    ],
    "created_at": "2024-05-12T10:00:00.000Z",
    "updated_at": "2024-05-12T10:00:00.000Z"
  },
  "meta": {}
}
```

### `PATCH /api/v1/zones/add-pin-code`

```json
{ "zone_id": "664b...", "post_office": "Garia", "pin_code": 700084 }
```

### `PATCH /api/v1/zones/remove-pin-code`

```json
{ "zone_id": "664b...", "pin_code": 700032 }
```

### `PATCH /api/v1/zones/add-bulk-pin-code`

```json
{
  "zone_id": "664b...",
  "zone": [
    { "post_office": "Baruipur", "pin_code": 700144 },
    { "post_office": "Sonarpur", "pin_code": 700150 }
  ]
}
```

### `PATCH /api/v1/zones/remove-bulk-pin-code`

```json
{ "zone_id": "664b...", "pin_codes": [700032, 700033] }
```

---

## Store Category Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/store-categories` | 🔒 | Create |
| GET | `/api/v1/store-categories` | 🔒 | List all |
| GET | `/api/v1/store-categories/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/store-categories/:id` | 🔒 | Update |
| DELETE | `/api/v1/store-categories/:id` | 🔒 | Soft delete |

### `POST /api/v1/store-categories`

```json
{ "name": "Restaurant" }
```

Slug is auto-generated from name using slugify. `201 Created` on success.

### `GET /api/v1/store-categories`

**Query Parameters:** `page`, `limit`, `search`

---

## Store Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/stores` | 🔒 | Create store |
| GET | `/api/v1/stores` | Public | List all stores |
| GET | `/api/v1/stores/:id` | Public | Get by ID |
| PUT | `/api/v1/stores/:id` | 🔒 | Update store |
| PATCH | `/api/v1/stores/:id/status` | 🔒 | Update status |
| DELETE | `/api/v1/stores/:id` | 🔒 | Soft delete |
| GET | `/api/v1/stores/pin-code/:pin-code` | Public | Get by pin code |

**Status values:** `ACTIVE` | `INACTIVE` | `BLOCKED`

### `POST /api/v1/stores`

**Request Body**

```json
{
  "name": "Spice Garden",
  "phone_number": "9000011112",
  "email": "spice@example.com",
  "pin_code": 700032,
  "latitude": 22.4990,
  "longitude": 88.3720,
  "address": "12, Lake Road, Jadavpur, Kolkata - 700032",
  "timezone": "Asia/Kolkata",
  "category_id": "664d4e7f5g2b6c004d5g1f33",
  "gstin": "19AABCS1429B1ZR",
  "is_doordrop": true,
  "is_refund": true,
  "logo_url": "https://cdn.example.com/logos/spicegarden.png",
  "banner_url": "https://cdn.example.com/banners/spicegarden.png",
  "working_hours": [
    { "day": "Monday", "open_time": "09:00", "close_time": "22:00" },
    { "day": "Sunday", "open_time": "10:00", "close_time": "20:00" }
  ]
}
```

**Day enum:** `Monday` | `Tuesday` | `Wednesday` | `Thursday` | `Friday` | `Saturday` | `Sunday`

Slug is auto-generated from name.

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Store created successfully",
  "data": {
    "_id": "664e5f8g6h3c7d005e6h2g44",
    "name": "Spice Garden",
    "slug": "spice-garden",
    "status": "ACTIVE",
    "pin_code": 700032,
    "is_doordrop": true,
    "is_refund": true,
    "created_at": "2024-05-13T12:00:00.000Z",
    "updated_at": "2024-05-13T12:00:00.000Z"
  },
  "meta": {}
}
```

### `GET /api/v1/stores`

**Query Parameters:** `page`, `limit`, `search` (name/email/address), `status`, `category_id`, `pin_code`

```
GET /api/v1/stores?page=1&limit=10&search=spice&status=ACTIVE&category_id=664d...
```

### `GET /api/v1/stores/pin-code/:pin-code`

Returns all `ACTIVE` stores in a given pin code area. Supports `page` and `limit`.

```
GET /api/v1/stores/pin-code/700032
```

### `PATCH /api/v1/stores/:id/status`

```json
{ "status": "BLOCKED" }
```

---

## Store User Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/store-users` | 🔒 | Create & assign to store |
| GET | `/api/v1/store-users` | 🔒 | List all |
| GET | `/api/v1/store-users/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/store-users/:id` | 🔒 | Update |
| PATCH | `/api/v1/store-users/:id/status` | 🔒 | Publish/unpublish |
| DELETE | `/api/v1/store-users/:id` | 🔒 | Soft delete |
| GET | `/api/v1/store-users/:storeId/store-users` | 🔒 | Get all users of a store |

**Roles:** `STORE_MANAGER` | `POS`

### `POST /api/v1/store-users`

**Request Body**

```json
{
  "first_name": "Amit",
  "last_name": "Das",
  "phone": "9012345678",
  "email": "amit@example.com",
  "role": "STORE_MANAGER",
  "username": "amit_das_sg",
  "password": "StrongPass@2024",
  "store_id": "664e5f8g6h3c7d005e6h2g44"
}
```

Password is bcrypt-hashed before storage and is **never returned** in any response.

### `GET /api/v1/store-users`

**Query Parameters:** `page`, `limit`, `search` (first/last name, email, username, phone), `store_id`, `role`, `status`

### `PATCH /api/v1/store-users/:id/status`

```json
{ "is_published": false }
```

---

## Product Category Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/product-categories` | 🔒 | Create |
| GET | `/api/v1/product-categories` | 🔒 | List all |
| GET | `/api/v1/product-categories/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/product-categories/:id` | 🔒 | Update |
| DELETE | `/api/v1/product-categories/:id` | 🔒 | Soft delete |

### `POST /api/v1/product-categories`

```json
{ "name": "Starters", "store_id": "664e5f8g6h3c7d005e6h2g44" }
```

### `GET /api/v1/product-categories`

**Query Parameters:** `page`, `limit`, `search`, `store_id`

---

## Product Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/products` | 🔒 | Create product |
| GET | `/api/v1/products` | 🔒 | List all |
| GET | `/api/v1/products/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/products/:id` | 🔒 | Update |
| PATCH | `/api/v1/products/:id/stock` | 🔒 | Update stock only |
| DELETE | `/api/v1/products/:id` | 🔒 | Soft delete |
| GET | `/api/v1/products/stores/:storeId` | 🔒 | Get products by store |

**type:** `SIMPLE` | `VARIANT`
**tax_class:** `STANDARD` | `GST12` | `GST15` | `GST18`
**tax_status:** `TAXABLE` | `NON_TAXABLE`

### `POST /api/v1/products`

**Request Body**

```json
{
  "name": "Paneer Tikka",
  "type": "SIMPLE",
  "sku": "SG-STR-001",
  "stock": 50,
  "store_id": "664e5f8g6h3c7d005e6h2g44",
  "category_id": "665g7h0i8j5e9f007g8j4i66",
  "regular_price": 280,
  "price": 250,
  "tax_class": "GST18",
  "tax_status": "TAXABLE",
  "description": "Succulent paneer marinated in spices, grilled in tandoor.",
  "tags": ["starter", "vegetarian", "tandoor"],
  "images": ["https://cdn.example.com/products/paneer-tikka.jpg"]
}
```

**Validation:** stock >= 0, price >= 0, regular_price >= 0, sku unique.

### `GET /api/v1/products`

**Query Parameters:** `page`, `limit`, `search` (full-text: name/description/tags), `store_id`, `category_id`, `type`, `tax_status`

### `PATCH /api/v1/products/:id/stock`

```json
{ "stock": 75 }
```

**Validation:** stock must be >= 0.

### `GET /api/v1/products/stores/:storeId`

**Query Parameters:** `page`, `limit`, `search`, `category_id`

---

## Product Variant Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/product-variants` | 🔒 | Create variant |
| GET | `/api/v1/product-variants` | 🔒 | List all |
| GET | `/api/v1/product-variants/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/product-variants/:id` | 🔒 | Update |
| PATCH | `/api/v1/product-variants/:id/stock` | 🔒 | Update stock only |
| DELETE | `/api/v1/product-variants/:id` | 🔒 | Soft delete |
| GET | `/api/v1/product-variants/products/:productId` | 🔒 | Get by product |

> Only products with `type: VARIANT` should have variants. SKU must be globally unique across all variants.

### `POST /api/v1/product-variants`

**Request Body**

```json
{
  "product_id": "666h8i1j9k6f0g008h9k5j77",
  "variant_name": "500ml",
  "sku": "SG-DRK-001-500",
  "price": 80,
  "stock": 100,
  "image_url": "https://cdn.example.com/variants/lassi-500ml.jpg"
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Product variant created successfully",
  "data": {
    "_id": "667i9j2k0l7g1h009i0l6k88",
    "product_id": "666h8i1j9k6f0g008h9k5j77",
    "variant_name": "500ml",
    "sku": "SG-DRK-001-500",
    "price": 80,
    "stock": 100,
    "image_url": "https://cdn.example.com/variants/lassi-500ml.jpg",
    "created_at": "2024-05-15T09:00:00.000Z"
  },
  "meta": {}
}
```

---

## Cart Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/cart` | 🔒 | Add item to cart / create cart |
| GET | `/api/v1/cart` | 🔒 | List all carts (admin) |
| GET | `/api/v1/cart/customer/:customerId` | 🔒 | Get cart by customer |
| PUT | `/api/v1/cart/:id` | 🔒 | Replace cart items |
| DELETE | `/api/v1/cart/:id` | 🔒 | Remove item or clear cart |
| PATCH | `/api/v1/cart/:id` | 🔒 | Increase or decrease item quantity |

### `POST /api/v1/cart`

Adds an item to the customer's cart. Creates a new cart if one does not exist for the customer. If the item already exists, its quantity is incremented.

**Request Body**

```json
{
  "customer_id": "cust_abc123",
  "store_id": "664e5f8g6h3c7d005e6h2g44",
  "product_id": "666h8i1j9k6f0g008h9k5j77",
  "variant_id": null,
  "quantity": 2
}
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "_id": "cart_001",
    "customer_id": "cust_abc123",
    "store_id": "664e5f8g6h3c7d005e6h2g44",
    "items": [
      {
        "product_id": "666h8i1j9k6f0g008h9k5j77",
        "variant_id": null,
        "name": "Paneer Tikka",
        "sku": "SG-STR-001",
        "quantity": 2,
        "unit_price": 250,
        "total_price": 500,
        "image_url": "https://cdn.example.com/products/paneer-tikka.jpg"
      }
    ],
    "subtotal": 500,
    "discount": 0,
    "total": 500,
    "updated_at": "2024-05-18T10:00:00.000Z"
  },
  "meta": {}
}
```

### `PATCH /api/v1/cart/:id`

Increase or decrease item quantity. Removes item if quantity reaches zero.

**Request Body**

```json
{
  "product_id": "666h8i1j9k6f0g008h9k5j77",
  "variant_id": null,
  "action": "INCREASE"
}
```

**action values:** `INCREASE` | `DECREASE`

### `GET /api/v1/cart/customer/:customerId`

Returns the customer's active cart including all items, subtotal, discount, and total.

---

## Wishlist Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/wishlist` | 🔒 | Add item to wishlist |
| GET | `/api/v1/wishlist` | 🔒 | List all wishlists (admin) |
| GET | `/api/v1/wishlist/customer/:customerId` | 🔒 | Get wishlist by customer |
| PUT | `/api/v1/wishlist/:id` | 🔒 | Replace wishlist items |
| DELETE | `/api/v1/wishlist/:id` | 🔒 | Remove item from wishlist |
| PATCH | `/api/v1/wishlist/:id` | 🔒 | Toggle item (add/remove) |

### `POST /api/v1/wishlist`

**Request Body**

```json
{
  "customer_id": "cust_abc123",
  "product_id": "666h8i1j9k6f0g008h9k5j77",
  "variant_id": null
}
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Item added to wishlist",
  "data": {
    "_id": "wish_001",
    "customer_id": "cust_abc123",
    "items": [
      {
        "product_id": "666h8i1j9k6f0g008h9k5j77",
        "name": "Paneer Tikka",
        "price": 250,
        "image_url": "https://cdn.example.com/products/paneer-tikka.jpg",
        "added_at": "2024-05-18T10:00:00.000Z"
      }
    ],
    "updated_at": "2024-05-18T10:00:00.000Z"
  },
  "meta": {}
}
```

### `PATCH /api/v1/wishlist/:id`

Toggle an item in the wishlist — adds it if absent, removes it if present.

```json
{ "product_id": "666h8i1j9k6f0g008h9k5j77", "variant_id": null }
```

---

## Coupon Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/coupons` | 🔒 | Create coupon |
| GET | `/api/v1/coupons` | 🔒 | List all (admin) |
| GET | `/api/v1/coupons/public` | Public | List public active coupons |
| GET | `/api/v1/coupons/code/:code` | Public | Get coupon by code |
| GET | `/api/v1/coupons/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/coupons/:id` | 🔒 | Update |
| DELETE | `/api/v1/coupons/:id` | 🔒 | Soft delete |
| PATCH | `/api/v1/coupons/:id/status` | 🔒 | Enable / disable |
| POST | `/api/v1/coupons/:id/validate` | 🔒 | Validate coupon for order |

**type:** `PERCENTAGE` | `FLAT`

### `POST /api/v1/coupons`

**Request Body**

```json
{
  "code": "SAVE20",
  "description": "Get 20% off on orders above ₹500",
  "type": "PERCENTAGE",
  "value": 20,
  "min_order_value": 500,
  "max_discount": 150,
  "usage_limit": 1000,
  "per_user_limit": 1,
  "valid_from": "2024-06-01T00:00:00.000Z",
  "valid_until": "2024-06-30T23:59:59.000Z",
  "store_id": null,
  "is_public": true
}
```

**Validation:** value > 0, for PERCENTAGE value <= 100, min_order_value >= 0, valid_from < valid_until, code must be uppercase and unique.

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "_id": "668a...",
    "code": "SAVE20",
    "type": "PERCENTAGE",
    "value": 20,
    "min_order_value": 500,
    "max_discount": 150,
    "usage_count": 0,
    "is_active": true,
    "is_public": true,
    "valid_from": "2024-06-01T00:00:00.000Z",
    "valid_until": "2024-06-30T23:59:59.000Z",
    "created_at": "2024-05-20T08:00:00.000Z",
    "updated_at": "2024-05-20T08:00:00.000Z"
  },
  "meta": {}
}
```

### `POST /api/v1/coupons/:id/validate`

Validates a coupon for a given customer and order value. Returns the discount amount if valid.

**Request Body**

```json
{
  "customer_id": "cust_abc123",
  "order_value": 650
}
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "coupon_id": "668a...",
    "code": "SAVE20",
    "discount": 130,
    "final_amount": 520
  },
  "meta": {}
}
```

**Error Response** `400 Bad Request`

```json
{
  "success": false,
  "message": "Coupon validation failed",
  "error": { "reason": "MIN_ORDER_NOT_MET", "message": "Minimum order value of ₹500 is required" }
}
```

**Validation checks:** coupon exists, is_active, not expired, usage_limit not exceeded, per_user_limit not exceeded for this customer, min_order_value met.

### `GET /api/v1/coupons/public`

Returns all active public coupons. No auth required. Supports `page` and `limit`.

### `GET /api/v1/coupons/code/:code`

Fetches a coupon by its code string. Useful for manual code entry at checkout.

### `PATCH /api/v1/coupons/:id/status`

```json
{ "is_active": false }
```

---

## Coupon Usage Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/coupon-usages` | 🔒 | Record coupon usage |
| GET | `/api/v1/coupon-usages` | 🔒 | List all usages (admin) |
| GET | `/api/v1/coupon-usages/:id` | 🔒 | Get by ID |
| GET | `/api/v1/coupon-usages/customers/:customerId` | 🔒 | Get by customer |
| GET | `/api/v1/coupon-usages/usages/:couponId` | 🔒 | Get all usages for a coupon |

### `POST /api/v1/coupon-usages`

Called internally when an order is placed with a coupon. Records usage against customer and order.

**Request Body**

```json
{
  "coupon_id": "668a...",
  "customer_id": "cust_abc123",
  "order_id": "669b...",
  "discount": 130
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Coupon usage recorded",
  "data": {
    "_id": "66aa...",
    "coupon_id": "668a...",
    "customer_id": "cust_abc123",
    "order_id": "669b...",
    "discount": 130,
    "used_at": "2024-05-21T14:30:00.000Z"
  },
  "meta": {}
}
```

---

## Review Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/reviews` | 🔒 | Create review |
| GET | `/api/v1/reviews` | 🔒 | List all (admin) |
| GET | `/api/v1/reviews/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/reviews/:id` | 🔒 | Update |
| DELETE | `/api/v1/reviews/:id` | 🔒 | Soft delete |
| GET | `/api/v1/reviews/customer/:customerId` | 🔒 | Get by customer |
| GET | `/api/v1/reviews/products/:productId` | 🔒 | Get by product |
| GET | `/api/v1/reviews/order/:orderId` | 🔒 | Get by order |

### `POST /api/v1/reviews`

A customer can only review a product they have ordered. One review per order item.

**Request Body**

```json
{
  "order_id": "669b...",
  "product_id": "666h8i1j9k6f0g008h9k5j77",
  "customer_id": "cust_abc123",
  "store_id": "664e5f8g6h3c7d005e6h2g44",
  "rating": 5,
  "comment": "Absolutely delicious! The paneer was perfectly marinated.",
  "images": ["https://cdn.example.com/reviews/img1.jpg"]
}
```

**Validation:** rating must be between 1 and 5 (integer), comment is optional, customer must have a delivered order containing this product.

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "_id": "66bb...",
    "product_id": "666h8i1j9k6f0g008h9k5j77",
    "customer_id": "cust_abc123",
    "rating": 5,
    "comment": "Absolutely delicious!",
    "is_verified": false,
    "created_at": "2024-05-22T09:00:00.000Z"
  },
  "meta": {}
}
```

### `GET /api/v1/reviews/products/:productId`

**Query Parameters:** `page`, `limit`, `rating` (filter by rating 1–5)

---

## Order Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/orders` | 🔒 | Place order |
| GET | `/api/v1/orders` | 🔒 | List all orders (admin) |
| GET | `/api/v1/orders/:id` | 🔒 | Get by ID |
| GET | `/api/v1/orders/by-number/:orderNo` | 🔒 | Get by order number |
| PUT | `/api/v1/orders/:id` | 🔒 | Update order details |
| DELETE | `/api/v1/orders/:id` | 🔒 | Soft delete |
| PATCH | `/api/v1/orders/:id/cancel` | 🔒 | Cancel order |
| PATCH | `/api/v1/orders/:id/confirm` | 🔒 | Confirm order |
| PATCH | `/api/v1/orders/:id/pack` | 🔒 | Mark as packed |
| PATCH | `/api/v1/orders/:id/deliver` | 🔒 | Mark as delivered |
| GET | `/api/v1/orders/customers/:customerId` | 🔒 | Orders by customer |
| GET | `/api/v1/orders/stores/:storeId` | 🔒 | Orders by store |
| GET | `/api/v1/orders/status-history/:id` | 🔒 | Status history of order |
| GET | `/api/v1/orders/:id/items` | 🔒 | Order items |
| GET | `/api/v1/orders/:id/payment` | 🔒 | Payment detail for order |
| GET | `/api/v1/orders/:id/delivery` | 🔒 | Delivery detail for order |

**Order status flow:**

```
PENDING → CONFIRMED → PACKED → OUT_FOR_DELIVERY → DELIVERED
       ↘ CANCELLED
DELIVERED → REFUNDED (on refund approval)
```

### `POST /api/v1/orders`

**Request Body**

```json
{
  "customer_id": "cust_abc123",
  "store_id": "664e5f8g6h3c7d005e6h2g44",
  "items": [
    {
      "product_id": "666h8i1j9k6f0g008h9k5j77",
      "variant_id": null,
      "quantity": 2,
      "unit_price": 250
    }
  ],
  "coupon_id": "668a...",
  "delivery_charge": 30,
  "tax": 45,
  "note": "No onions please",
  "address": {
    "line1": "45, Park Street",
    "line2": "Flat 3B",
    "city": "Kolkata",
    "state": "West Bengal",
    "pin_code": 700016,
    "country": "India"
  }
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "669b...",
    "order_no": "ORD-20240521-0042",
    "customer_id": "cust_abc123",
    "store_id": "664e5f8g6h3c7d005e6h2g44",
    "status": "PENDING",
    "subtotal": 500,
    "discount": 130,
    "delivery_charge": 30,
    "tax": 45,
    "total": 445,
    "payment_status": "PENDING",
    "created_at": "2024-05-21T14:30:00.000Z",
    "updated_at": "2024-05-21T14:30:00.000Z"
  },
  "meta": {}
}
```

### `PATCH /api/v1/orders/:id/cancel`

Cancels an order. Only allowed when status is `PENDING` or `CONFIRMED`.

**Request Body**

```json
{ "reason": "Customer changed their mind" }
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "669b...",
    "status": "CANCELLED",
    "updated_at": "2024-05-21T15:00:00.000Z"
  }
}
```

**Error Response** `400 Bad Request`

```json
{
  "success": false,
  "message": "Cannot cancel order",
  "error": { "reason": "INVALID_STATUS_TRANSITION", "message": "Orders that are packed or out for delivery cannot be cancelled" }
}
```

### `PATCH /api/v1/orders/:id/confirm`

Confirms a `PENDING` order. Typically called by the store after reviewing the order.

### `PATCH /api/v1/orders/:id/pack`

Marks a `CONFIRMED` order as `PACKED`. Indicates items are ready for pickup.

### `PATCH /api/v1/orders/:id/deliver`

Marks a `PACKED` order as `OUT_FOR_DELIVERY` and eventually `DELIVERED`.

### `GET /api/v1/orders`

**Query Parameters:** `page`, `limit`, `status`, `store_id`, `customer_id`, `payment_status`

### `GET /api/v1/orders/by-number/:orderNo`

Fetch order by human-readable order number (e.g. `ORD-20240521-0042`).

### `GET /api/v1/orders/status-history/:id`

Returns the full status change history for an order in chronological order.

```json
{
  "success": true,
  "data": [
    { "status": "PENDING", "note": "Order placed", "changed_by": "cust_abc123", "created_at": "2024-05-21T14:30:00.000Z" },
    { "status": "CONFIRMED", "note": "Confirmed by store", "changed_by": "664f...", "created_at": "2024-05-21T14:45:00.000Z" }
  ]
}
```

---

## Payment Module

> Payments are **UPI-based**. The flow is: create → customer pays → verify or failure.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/payments/create` | 🔒 | Create payment intent |
| POST | `/api/v1/payments/verify` | 🔒 | Verify successful payment |
| POST | `/api/v1/payments/failure` | 🔒 | Record payment failure |
| POST | `/api/v1/payments/webhook` | Public | Payment gateway webhook |

**method:** `UPI` | `CASH` | `ONLINE`
**status:** `PENDING` | `SUCCESS` | `FAILED` | `REFUNDED`

### `POST /api/v1/payments/create`

Creates a payment record tied to an order. Returns UPI payment details for the customer to complete the transaction.

**Request Body**

```json
{
  "order_id": "669b...",
  "customer_id": "cust_abc123",
  "amount": 445,
  "method": "UPI"
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Payment created",
  "data": {
    "_id": "66cc...",
    "order_id": "669b...",
    "amount": 445,
    "currency": "INR",
    "method": "UPI",
    "status": "PENDING",
    "upi_txn_id": null,
    "created_at": "2024-05-21T14:31:00.000Z"
  },
  "meta": {}
}
```

### `POST /api/v1/payments/verify`

Called after the customer completes UPI payment. Verifies the transaction and updates order `payment_status` to `PAID`.

**Request Body**

```json
{
  "payment_id": "66cc...",
  "upi_txn_id": "TXN20240521143200",
  "upi_ref_id": "REF98765432",
  "gateway_response": { "status": "success", "code": "00" }
}
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "_id": "66cc...",
    "status": "SUCCESS",
    "upi_txn_id": "TXN20240521143200",
    "paid_at": "2024-05-21T14:32:00.000Z"
  }
}
```

### `POST /api/v1/payments/failure`

Records a failed payment attempt. Order `payment_status` remains `PENDING` to allow retry.

**Request Body**

```json
{
  "payment_id": "66cc...",
  "reason": "UPI transaction declined",
  "gateway_response": { "status": "failed", "code": "U69" }
}
```

### `POST /api/v1/payments/webhook`

Public endpoint for receiving real-time payment events from the payment gateway. Verifies webhook signature and updates payment and order status accordingly.

**Request Body** — varies by gateway. Must include a signature header for verification.

---

## Refund Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/refunds` | 🔒 | Initiate refund |
| GET | `/api/v1/refunds` | 🔒 | List all refunds |
| GET | `/api/v1/refunds/:id` | 🔒 | Get by ID |
| PATCH | `/api/v1/refunds/:id/status` | 🔒 | Approve or reject refund |
| GET | `/api/v1/refunds/status` | 🔒 | Filter refunds by status |
| GET | `/api/v1/refunds/orders/:id` | 🔒 | Refund by order ID |
| GET | `/api/v1/refunds/payments/:id` | 🔒 | Refund by payment ID |

**status:** `PENDING` | `APPROVED` | `REJECTED` | `PROCESSED`

### `POST /api/v1/refunds`

Initiates a refund request for a delivered or cancelled order.

**Request Body**

```json
{
  "order_id": "669b...",
  "payment_id": "66cc...",
  "customer_id": "cust_abc123",
  "amount": 445,
  "reason": "Item was stale on delivery",
  "upi_id": "customer@upi"
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Refund request submitted",
  "data": {
    "_id": "66dd...",
    "order_id": "669b...",
    "amount": 445,
    "status": "PENDING",
    "reason": "Item was stale on delivery",
    "upi_id": "customer@upi",
    "created_at": "2024-05-22T10:00:00.000Z"
  }
}
```

### `PATCH /api/v1/refunds/:id/status`

Approves or rejects a refund request. On approval, triggers the UPI refund transfer.

**Request Body**

```json
{
  "status": "APPROVED",
  "note": "Verified complaint — refund approved"
}
```

**status values:** `APPROVED` | `REJECTED`

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Refund approved successfully",
  "data": {
    "_id": "66dd...",
    "status": "APPROVED",
    "processed_at": "2024-05-22T11:00:00.000Z"
  }
}
```

### `GET /api/v1/refunds/status`

**Query Parameters:** `status` (PENDING | APPROVED | REJECTED | PROCESSED), `page`, `limit`

```
GET /api/v1/refunds/status?status=PENDING&page=1&limit=10
```

---

## Order Delivery Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/order-deliveries` | 🔒 | Assign delivery person |
| GET | `/api/v1/order-deliveries` | 🔒 | List all deliveries |
| GET | `/api/v1/order-deliveries/:id` | 🔒 | Get by ID |
| PUT | `/api/v1/order-deliveries/:id` | 🔒 | Update delivery record |
| DELETE | `/api/v1/order-deliveries/:id` | 🔒 | Delete delivery record |

**status:** `ASSIGNED` | `PICKED_UP` | `IN_TRANSIT` | `DELIVERED` | `FAILED`

### `POST /api/v1/order-deliveries`

**Request Body**

```json
{
  "order_id": "669b...",
  "delivery_person": "Raju Delivery",
  "phone": "9800012345",
  "tracking_url": "https://track.example.com/ORD-20240521-0042",
  "estimated_at": "2024-05-21T16:00:00.000Z"
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Delivery assigned successfully",
  "data": {
    "_id": "66ee...",
    "order_id": "669b...",
    "delivery_person": "Raju Delivery",
    "phone": "9800012345",
    "status": "ASSIGNED",
    "estimated_at": "2024-05-21T16:00:00.000Z",
    "created_at": "2024-05-21T14:40:00.000Z"
  }
}
```

### `PUT /api/v1/order-deliveries/:id`

Updates delivery status, tracking URL, delivered time, or failure reason.

**Request Body**

```json
{
  "status": "DELIVERED",
  "delivered_at": "2024-05-21T15:55:00.000Z"
}
```

---

## Order Status History Module

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/orders-status-histories` | 🔒 | Record status change |
| GET | `/api/v1/orders-status-histories` | 🔒 | List all history records |
| GET | `/api/v1/orders-status-histories/:id` | 🔒 | Get by ID |

> Status history is automatically recorded by the server when an order status changes via cancel, confirm, pack, or deliver endpoints. This module also supports manual history entries.

### `POST /api/v1/orders-status-histories`

**Request Body**

```json
{
  "order_id": "669b...",
  "status": "CONFIRMED",
  "note": "Confirmed by store manager",
  "changed_by": "664f6g9h..."
}
```

**Success Response** `201 Created`

```json
{
  "success": true,
  "message": "Status history recorded",
  "data": {
    "_id": "66ff...",
    "order_id": "669b...",
    "status": "CONFIRMED",
    "note": "Confirmed by store manager",
    "changed_by": "664f6g9h...",
    "created_at": "2024-05-21T14:45:00.000Z"
  }
}
```

---

## Validation Rules

| Field | Rule |
|---|---|
| `email` | Must be a valid RFC email address |
| `phone` / `phone_number` | 10–15 digit string |
| `stock` | Must be >= 0 (integer) |
| `price`, `amount` | Must be >= 0 (number) |
| `rating` | Integer between 1 and 5 inclusive |
| `coupon.value` | > 0; for PERCENTAGE type, value <= 100 |
| `coupon.valid_from` | Must be before `valid_until` |
| `coupon.code` | Uppercase letters/digits only, unique |
| `order status` | Must follow the defined status flow |
| `payment` | UPI transaction ID required on verify |
| `quantity` | Must be >= 1 |
| `product.sku` | Must be globally unique |
| `variant.sku` | Must be globally unique |
| `username` | Must be lowercase, unique |
| `password` | Minimum 6 characters |
| `pin_code` | 6-digit integer |

All request bodies are validated using **Zod** schemas in the DTO layer before reaching the service layer. Validation errors return `400 Bad Request` with a `VALIDATION_ERROR` reason and a comma-separated list of failing fields.

**Example validation error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "reason": "VALIDATION_ERROR",
    "message": "price: Number must be greater than or equal to 0, stock: Required"
  }
}
```

---

## Error Reference

| HTTP Code | Reason | Description |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Request body or query params failed Zod validation |
| `400` | `INVALID_STATUS_TRANSITION` | Attempted an invalid order status change |
| `400` | `MIN_ORDER_NOT_MET` | Cart total is below coupon minimum |
| `400` | `COUPON_EXPIRED` | Coupon has passed its valid_until date |
| `400` | `COUPON_USAGE_EXCEEDED` | Coupon usage limit reached |
| `401` | `INVALID_CREDENTIALS` | Wrong username or password |
| `401` | `INVALID_TOKEN` | JWT missing, invalid, or expired |
| `401` | `INVALID_OTP` | OTP does not match |
| `401` | `OTP_EXPIRED` | OTP has passed its 10-minute window |
| `401` | `INVALID_EMAIL` | Email not registered as administrator |
| `404` | `NOT_FOUND` | Resource does not exist or is soft-deleted |
| `409` | `DUPLICATE_ENTRY` | Unique constraint violation (email, SKU, username, code, slug) |
| `500` | `INTERNAL_ERROR` | Unexpected server-side error |

---

## Scripts

```bash
npm run dev     # Development with nodemon hot reload
npm start       # Production server
npm test        # Run tests
```

---

## Notes for Frontend Developers

- The **API docs UI** at `/api-docs` has a **Try It** panel on key endpoints. Enter your deployed base URL and Bearer token to fire live requests from the browser.
- All list endpoints return a consistent `meta` object: `{ page, limit, total, total_pages }`.
- **Soft-deleted records** are invisible in all GET responses. A `404` on a previously known ID means the record was deleted.
- The `_dev_otp` field in OTP responses appears **only in development** when no mail service is configured. In production, OTP arrives by email and this field is absent.
- Passwords are **never returned** in any response. The `password` field has `select: false` in the Mongoose schema.
- Store list and detail endpoints are **public** — no token required. All other routes require `Authorization: Bearer <token>`.
- Slugs are **auto-generated server-side** from the `name` field via slugify. Do not send a `slug` field in create/update requests.
- The administrator account lives entirely in **ENV variables**. There is no admin record in MongoDB.
- Cart totals (`subtotal`, `discount`, `total`) are **recalculated server-side** on every add/update operation — do not rely on client-side calculations.
- Coupon discount is applied server-side during order placement. Always call `/coupons/:id/validate` before displaying the discount to the user.

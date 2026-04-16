# Customer + Address Module

Part of the **Auth + Customer Microservice** in a 3-service architecture.

**Stack:** Node.js · CommonJS · Express · Neon PostgreSQL · Prisma · Zod · JWT · bcryptjs

---

## Quick Start

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL and JWT_SECRET
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Server starts on `http://localhost:5000`.

---

## Environment Variables

| Variable       | Description                            |
|----------------|----------------------------------------|
| `PORT`         | HTTP port (default: 5000)              |
| `DATABASE_URL` | Neon PostgreSQL connection string      |
| `JWT_SECRET`   | Secret for signing/verifying JWTs      |
| `NODE_ENV`     | `development` or `production`          |

---

## Authentication

Protected routes require:
```
Authorization: Bearer <jwt_token>
```

The token payload must contain `id` (customer id). `req.user.id` is used for all `/me` routes.

---

## API Reference

### Customer Routes

| Method | Path                              | Auth | Description              |
|--------|-----------------------------------|------|--------------------------|
| GET    | `/api/v1/customers/me`            | JWT  | Get own profile          |
| PUT    | `/api/v1/customers/me`            | JWT  | Update own profile       |
| PATCH  | `/api/v1/customers/me/profile-image` | JWT | Update profile image  |
| POST   | `/api/v1/customers`               | —    | Create customer          |
| GET    | `/api/v1/customers`               | —    | List customers (paginated) |
| GET    | `/api/v1/customers/:id`           | —    | Get customer by ID       |
| PUT    | `/api/v1/customers/:id`           | —    | Update customer          |
| DELETE | `/api/v1/customers/:id`           | —    | Delete customer          |

### Address Routes (all JWT-protected)

| Method | Path                                                       | Description            |
|--------|------------------------------------------------------------|------------------------|
| POST   | `/api/v1/customers/:customerId/addresses`                  | Add address            |
| GET    | `/api/v1/customers/:customerId/addresses`                  | List addresses         |
| GET    | `/api/v1/customers/:customerId/addresses/:addressId`       | Get address            |
| PUT    | `/api/v1/customers/:customerId/addresses/:addressId`       | Update address         |
| PATCH  | `/api/v1/customers/:customerId/addresses/:addressId/default` | Set as default       |
| DELETE | `/api/v1/customers/:customerId/addresses/:addressId`       | Delete address         |

---

## Request / Response Examples

### 1. Create Customer — Request

```http
POST /api/v1/customers
Content-Type: application/json

{
  "first_name": "Priya",
  "last_name": "Sharma",
  "phone": "+919876543210",
  "email": "priya.sharma@example.com",
  "password": "SecurePass123",
  "profile_image_url": "https://cdn.example.com/avatars/priya.jpg"
}
```

### 2. Create Customer — Response

```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "clx9k2m0f0000abc123xyz",
    "first_name": "Priya",
    "last_name": "Sharma",
    "phone": "+919876543210",
    "email": "priya.sharma@example.com",
    "profile_image_url": "https://cdn.example.com/avatars/priya.jpg",
    "is_verified": false,
    "created_at": "2024-11-15T09:32:10.000Z",
    "updated_at": "2024-11-15T09:32:10.000Z"
  }
}
```

> Password is never returned in any response.

---

### 3. Update Customer — Request

```http
PUT /api/v1/customers/clx9k2m0f0000abc123xyz
Content-Type: application/json

{
  "first_name": "Priya",
  "last_name": "Sharma-Patel",
  "phone": "+919876543211"
}
```

---

### 4. Customer List — Response with Pagination

```http
GET /api/v1/customers?page=1&limit=10&search=priya&sort_by=created_at&sort_order=desc
```

```json
{
  "success": true,
  "message": "Customers fetched successfully",
  "data": [
    {
      "id": "clx9k2m0f0000abc123xyz",
      "first_name": "Priya",
      "last_name": "Sharma",
      "phone": "+919876543210",
      "email": "priya.sharma@example.com",
      "profile_image_url": "https://cdn.example.com/avatars/priya.jpg",
      "is_verified": true,
      "created_at": "2024-11-15T09:32:10.000Z",
      "updated_at": "2024-11-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

---

### 5. Create Address — Request

```http
POST /api/v1/customers/clx9k2m0f0000abc123xyz/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Priya Sharma",
  "phone": "+919876543210",
  "address_line_1": "42 MG Road, Indiranagar",
  "address_line_2": "Near HDFC ATM",
  "landmark": "Opposite Total Mall",
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "pin_code": 560038,
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address_type": "HOME",
  "is_default": true
}
```

### 6. Create Address — Response

```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "id": "clx9m4p0g0000def456uvw",
    "customer_id": "clx9k2m0f0000abc123xyz",
    "full_name": "Priya Sharma",
    "phone": "+919876543210",
    "address_line_1": "42 MG Road, Indiranagar",
    "address_line_2": "Near HDFC ATM",
    "landmark": "Opposite Total Mall",
    "city": "Bengaluru",
    "state": "Karnataka",
    "country": "India",
    "pin_code": 560038,
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address_type": "HOME",
    "is_default": true,
    "created_at": "2024-11-15T09:45:00.000Z",
    "updated_at": "2024-11-15T09:45:00.000Z"
  }
}
```

---

### 7. Set Default Address — Request

```http
PATCH /api/v1/customers/clx9k2m0f0000abc123xyz/addresses/clx9m4p0g0000def456uvw/default
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": {
    "id": "clx9m4p0g0000def456uvw",
    "customer_id": "clx9k2m0f0000abc123xyz",
    "is_default": true,
    "address_type": "HOME",
    "city": "Bengaluru",
    "updated_at": "2024-11-15T11:00:00.000Z"
  }
}
```

---

### 8. Address List — Response

```http
GET /api/v1/customers/clx9k2m0f0000abc123xyz/addresses?page=1&limit=10
Authorization: Bearer <token>
```

```json
{
  "success": true,
  "message": "Addresses fetched successfully",
  "data": [
    {
      "id": "clx9m4p0g0000def456uvw",
      "customer_id": "clx9k2m0f0000abc123xyz",
      "full_name": "Priya Sharma",
      "phone": "+919876543210",
      "address_line_1": "42 MG Road, Indiranagar",
      "address_line_2": "Near HDFC ATM",
      "landmark": "Opposite Total Mall",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "pin_code": 560038,
      "latitude": 12.9716,
      "longitude": 77.5946,
      "address_type": "HOME",
      "is_default": true,
      "created_at": "2024-11-15T09:45:00.000Z",
      "updated_at": "2024-11-15T11:00:00.000Z"
    },
    {
      "id": "clx9n5q1h0001ghi789rst",
      "customer_id": "clx9k2m0f0000abc123xyz",
      "full_name": "Priya Sharma",
      "phone": "+919876543210",
      "address_line_1": "Block C, DLF Phase 2",
      "address_line_2": null,
      "landmark": "Near Cyber Hub",
      "city": "Gurugram",
      "state": "Haryana",
      "country": "India",
      "pin_code": 122002,
      "latitude": 28.4595,
      "longitude": 77.0266,
      "address_type": "WORK",
      "is_default": false,
      "created_at": "2024-11-15T10:20:00.000Z",
      "updated_at": "2024-11-15T10:20:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "total_pages": 1
  }
}
```

---

## Business Rules

**Default address:** Only one address per customer can have `is_default: true`. Setting a new default uses a Prisma transaction to atomically unset all others before setting the chosen one. If you delete the default address, the service auto-promotes the most recently created remaining address.

**First address:** The first address created for a customer is automatically set as default, regardless of the `is_default` value in the request.

**Password:** Hashed with bcryptjs (12 salt rounds). Never included in any API response — all queries use `select` to explicitly exclude it.

**Cascade delete:** Deleting a customer cascade-deletes all their addresses (configured via Prisma `onDelete: Cascade`).

---

## NPM Scripts

| Script                  | Description                              |
|-------------------------|------------------------------------------|
| `npm run dev`           | Start with nodemon (auto-reload)         |
| `npm start`             | Start production server                  |
| `npm run prisma:generate` | Regenerate Prisma client               |
| `npm run prisma:migrate`  | Create and apply a named migration     |
| `npm run prisma:studio`   | Open Prisma Studio GUI                 |

---

## Folder Structure

```
src/
  config/           env.js · prisma.js · logger.js
  prisma/           schema.prisma
  dto/
    customer/       create · update · profile-image · query
    customer-address/ create · update · set-default · query
  repositories/     customer · customer-address
  services/         customer · customer-address
  controllers/      customer · customer-address
  routes/           customer · customer-address · index
  middleware/       auth · validation · error
  utils/            api-response · api-error · async-handler
  app.js
  server.js
```

# Mail + Logs Microservice

Production-ready microservice for mail templates, mail queuing, OTP delivery, and inventory logging.

**Stack:** Node.js · Express · Neon PostgreSQL · Prisma ORM · Zod · Nodemailer · Winston

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to your Neon database
npm run db:push

# 5. Start development server
npm run dev
```

The service starts on `http://localhost:5001` by default.

---

## Environment Variables

| Variable       | Description                                    |
|----------------|------------------------------------------------|
| `PORT`         | HTTP port (default: 5001)                      |
| `DATABASE_URL` | Neon PostgreSQL connection string              |
| `SMTP_HOST`    | SMTP server host                               |
| `SMTP_PORT`    | SMTP port (587 for TLS, 465 for SSL)           |
| `SMTP_USER`    | SMTP login username                            |
| `SMTP_PASS`    | SMTP login password                            |
| `MAIL_FROM`    | Sender address (e.g. `no-reply@example.com`)   |
| `API_KEY`      | Secret key sent via `x-api-key` header         |

---

## Authentication

All `/api/*` routes require the header:

```
x-api-key: <your API_KEY>
```

The `GET /health` endpoint is always open (no key required).

---

## API Reference

### Mail Templates — `/api/v1/mail-templates`

| Method | Path              | Description                  |
|--------|-------------------|------------------------------|
| POST   | `/`               | Create a template            |
| GET    | `/`               | List all templates           |
| GET    | `/:id`            | Get template by ID           |
| PUT    | `/:id`            | Replace template             |
| PATCH  | `/:id/status`     | Toggle `is_active`           |
| DELETE | `/:id`            | Delete template              |

**Template types:** `ORDER` `PAYMENT` `DELIVERY` `OTP` `PASSWORD_RESET` `WELCOME` `PROMOTION`

**Create body example:**
```json
{
  "name": "Welcome Email",
  "slug": "welcome-email",
  "subject": "Welcome to our platform!",
  "html_body": "<h1>Hi {{name}}, welcome!</h1>",
  "text_body": "Hi {{name}}, welcome!",
  "template_type": "WELCOME"
}
```

---

### Mail Queue — `/api/v1/mail-queues`

| Method | Path              | Description                          |
|--------|-------------------|--------------------------------------|
| POST   | `/`               | Enqueue an email                     |
| GET    | `/`               | List queue (filter with `?status=`)  |
| GET    | `/:id`            | Get queue item                       |
| PATCH  | `/:id/status`     | Manually set status                  |
| PATCH  | `/:id/retry`      | Reset FAILED item for retry          |
| POST   | `/process`        | **Trigger queue processor**          |
| DELETE | `/:id`            | Delete queue item                    |

**Enqueue body example:**
```json
{
  "template_id": "clxyz123",
  "recipient_email": "user@example.com",
  "recipient_name": "Jane Doe",
  "subject": "Your order is confirmed",
  "related_entity_type": "ORDER",
  "related_entity_id": "order-456",
  "payload": { "name": "Jane", "order_id": "order-456" },
  "scheduled_at": "2024-12-01T10:00:00.000Z"
}
```

Queue statuses: `PENDING` → `PROCESSING` → `SENT` / `FAILED` / `CANCELLED`

---

### Mail Logs — `/api/v1/mail-logs`

| Method | Path                      | Description                 |
|--------|---------------------------|-----------------------------|
| GET    | `/`                       | All logs                    |
| GET    | `/:id`                    | Log by ID                   |
| GET    | `/queue/:queueId`         | Logs for a queue item       |
| GET    | `/template/:templateId`   | Logs for a template         |
| GET    | `/status/:status`         | Filter by delivery status   |

Delivery statuses: `SENT` `DELIVERED` `OPENED` `CLICKED` `BOUNCED` `COMPLAINED` `FAILED`

---

### OTP — `/api/v1/otp`

| Method | Path       | Description        |
|--------|------------|--------------------|
| POST   | `/send`    | Send OTP email     |
| POST   | `/verify`  | Verify OTP code    |

OTP expires in **5 minutes**. Sending a new OTP for the same email + purpose auto-expires the previous one.

**Send body:**
```json
{ "email": "user@example.com", "purpose": "ADMIN_LOGIN" }
```

**Verify body:**
```json
{ "email": "user@example.com", "otp_code": "483920", "purpose": "ADMIN_LOGIN" }
```

OTP purposes: `ADMIN_LOGIN` `AUTHORIZED_PERSON_LOGIN` `PASSWORD_RESET`

---

### Inventory Logs — `/api/v1/inventory-logs`

| Method | Path                      | Description             |
|--------|---------------------------|-------------------------|
| POST   | `/`                       | Create log entry        |
| GET    | `/`                       | All logs                |
| GET    | `/:id`                    | Log by ID               |
| GET    | `/product/:productId`     | Logs for a product      |
| GET    | `/variant/:variantId`     | Logs for a variant      |

**Create body:**
```json
{
  "product_id": "prod-abc",
  "variant_id": "var-xyz",
  "change_type": "OUT",
  "quantity": 3,
  "reason": "Order fulfillment",
  "reference_id": "order-456"
}
```

Change types: `IN` `OUT` `ADJUST`

---

## Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 42, "total_pages": 5 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": { "reason": "VALIDATION_ERROR", "message": "email is required" }
}
```

---

## Queue Processor

The processor is **serverless-safe** — no `setInterval`. Trigger it via:

- **API call:** `POST /api/v1/mail-queues/process`
- **External cron:** Railway Cron, Vercel Cron, pg_cron, GitHub Actions schedule, etc.

**Processing flow per item:**

```
PENDING → PROCESSING → sendMail() → SENT + Mail_Log created
                                  ↘ failure → retry_count++ → back to PENDING
                                              (after 3 failures → FAILED)
```

Template variables in `html_body` / `text_body` use `{{variable}}` syntax and are interpolated from the queue item's `payload` JSON at send time.

---

## Folder Structure

```
src/
  config/         env.js · prisma.js · logger.js
  prisma/         schema.prisma
  dto/            Zod validation schemas per domain
  repositories/   Prisma data access layer
  services/       Business logic layer
  controllers/    HTTP handler layer
  routes/         Express routers
  middleware/     apiKey · errorHandler · requestLogger
  utils/          response.js · mailer.js · otp.js
  jobs/           queue.processor.js
  app.js          Express app
  server.js       HTTP server + graceful shutdown
```

---

## NPM Scripts

| Script           | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start with nodemon (auto-reload)         |
| `npm start`      | Start production server                  |
| `npm run db:generate` | Regenerate Prisma client            |
| `npm run db:push`     | Push schema to DB (no migration file)|
| `npm run db:migrate`  | Create and apply a named migration  |
| `npm run db:studio`   | Open Prisma Studio GUI              |

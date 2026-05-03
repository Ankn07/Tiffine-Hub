-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('IN', 'OUT', 'ADJUST');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('ORDER', 'PAYMENT', 'DELIVERY', 'OTP', 'PASSWORD_RESET', 'WELCOME', 'PROMOTION');

-- CreateEnum
CREATE TYPE "RelatedEntityType" AS ENUM ('ORDER', 'PAYMENT', 'DELIVERY', 'CUSTOMER', 'STORE', 'COUPON');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'FAILED');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('ADMIN_LOGIN', 'AUTHORIZED_PERSON_LOGIN', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED', 'FAILED');

-- CreateTable
CREATE TABLE "Inventory_Log" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "change_type" "ChangeType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mail_Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html_body" TEXT NOT NULL,
    "text_body" TEXT,
    "template_type" "TemplateType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mail_Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mail_Queue" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "related_entity_type" "RelatedEntityType",
    "related_entity_id" TEXT,
    "recipient_email" TEXT NOT NULL,
    "recipient_name" TEXT,
    "subject" TEXT NOT NULL,
    "payload" JSONB,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mail_Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mail_Log" (
    "id" TEXT NOT NULL,
    "queue_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "related_entity_type" "RelatedEntityType",
    "related_entity_id" TEXT,
    "recipient_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "provider" TEXT,
    "provider_message_id" TEXT,
    "delivery_status" "DeliveryStatus" NOT NULL,
    "opened_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),
    "bounced_at" TIMESTAMP(3),
    "complained_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mail_Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp_code" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified_at" TIMESTAMP(3),
    "status" "OtpStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inventory_Log_product_id_idx" ON "Inventory_Log"("product_id");

-- CreateIndex
CREATE INDEX "Inventory_Log_variant_id_idx" ON "Inventory_Log"("variant_id");

-- CreateIndex
CREATE INDEX "Inventory_Log_change_type_idx" ON "Inventory_Log"("change_type");

-- CreateIndex
CREATE INDEX "Inventory_Log_created_at_idx" ON "Inventory_Log"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Mail_Template_slug_key" ON "Mail_Template"("slug");

-- CreateIndex
CREATE INDEX "Mail_Template_slug_idx" ON "Mail_Template"("slug");

-- CreateIndex
CREATE INDEX "Mail_Template_template_type_idx" ON "Mail_Template"("template_type");

-- CreateIndex
CREATE INDEX "Mail_Template_is_active_idx" ON "Mail_Template"("is_active");

-- CreateIndex
CREATE INDEX "Mail_Queue_status_idx" ON "Mail_Queue"("status");

-- CreateIndex
CREATE INDEX "Mail_Queue_scheduled_at_idx" ON "Mail_Queue"("scheduled_at");

-- CreateIndex
CREATE INDEX "Mail_Queue_recipient_email_idx" ON "Mail_Queue"("recipient_email");

-- CreateIndex
CREATE INDEX "Mail_Queue_template_id_idx" ON "Mail_Queue"("template_id");

-- CreateIndex
CREATE INDEX "Mail_Queue_related_entity_type_related_entity_id_idx" ON "Mail_Queue"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE INDEX "Mail_Log_queue_id_idx" ON "Mail_Log"("queue_id");

-- CreateIndex
CREATE INDEX "Mail_Log_template_id_idx" ON "Mail_Log"("template_id");

-- CreateIndex
CREATE INDEX "Mail_Log_recipient_email_idx" ON "Mail_Log"("recipient_email");

-- CreateIndex
CREATE INDEX "Mail_Log_delivery_status_idx" ON "Mail_Log"("delivery_status");

-- CreateIndex
CREATE INDEX "Mail_Log_related_entity_type_related_entity_id_idx" ON "Mail_Log"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE INDEX "OTP_email_idx" ON "OTP"("email");

-- CreateIndex
CREATE INDEX "OTP_status_idx" ON "OTP"("status");

-- CreateIndex
CREATE INDEX "OTP_purpose_idx" ON "OTP"("purpose");

-- CreateIndex
CREATE INDEX "OTP_expires_at_idx" ON "OTP"("expires_at");

-- AddForeignKey
ALTER TABLE "Mail_Queue" ADD CONSTRAINT "Mail_Queue_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "Mail_Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mail_Log" ADD CONSTRAINT "Mail_Log_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Mail_Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

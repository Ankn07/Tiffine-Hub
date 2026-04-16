import { z } from 'zod';

const RelatedEntityType = z.enum([
  'ORDER', 'PAYMENT', 'DELIVERY', 'CUSTOMER', 'STORE', 'COUPON',
]);

const QueueStatus = z.enum(['PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED']);

export const CreateMailQueueDto = z.object({
  template_id: z.string().min(1),
  related_entity_type: RelatedEntityType.optional(),
  related_entity_id: z.string().optional(),
  recipient_email: z.string().email(),
  recipient_name: z.string().max(100).optional(),
  subject: z.string().min(1).max(255),
  payload: z.record(z.unknown()).optional(),
  scheduled_at: z.string().datetime().optional(),
});

export const PatchQueueStatusDto = z.object({
  status: QueueStatus,
});

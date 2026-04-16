import { z } from 'zod';

export const CreateInventoryLogDto = z.object({
  product_id: z.string().min(1),
  variant_id: z.string().optional(),
  change_type: z.enum(['IN', 'OUT', 'ADJUST']),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  reason: z.string().max(500).optional(),
  reference_id: z.string().optional(),
});

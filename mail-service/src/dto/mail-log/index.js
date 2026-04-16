import { z } from 'zod';

export const DeliveryStatusParam = z.enum([
  'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'FAILED',
]);

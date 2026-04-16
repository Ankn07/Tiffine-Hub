import { z } from 'zod';

const TemplateType = z.enum([
  'ORDER', 'PAYMENT', 'DELIVERY', 'OTP', 'PASSWORD_RESET', 'WELCOME', 'PROMOTION',
]);

export const CreateMailTemplateDto = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-_]+$/, 'Slug must be lowercase alphanumeric with hyphens/underscores'),
  subject: z.string().min(1).max(255),
  html_body: z.string().min(1),
  text_body: z.string().optional(),
  template_type: TemplateType,
  is_active: z.boolean().optional().default(true),
});

export const UpdateMailTemplateDto = CreateMailTemplateDto.partial().omit({ slug: true });

export const PatchMailTemplateStatusDto = z.object({
  is_active: z.boolean(),
});

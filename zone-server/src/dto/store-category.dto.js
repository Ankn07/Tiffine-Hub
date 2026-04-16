const { z } = require("zod");

const createStoreCategoryDto = z.object({
  name: z.string().min(2),
  created_by: z.string().optional(),
});

const updateStoreCategoryDto = z.object({
  name: z.string().min(2).optional(),
  updated_by: z.string().optional(),
});

module.exports = { createStoreCategoryDto, updateStoreCategoryDto };

const { z } = require("zod");

const createProductCategoryDto = z.object({
  name: z.string().min(2),
  store_id: z.string().min(1),
  created_by: z.string().optional(),
});

const updateProductCategoryDto = z.object({
  name: z.string().min(2).optional(),
  updated_by: z.string().optional(),
});

module.exports = { createProductCategoryDto, updateProductCategoryDto };

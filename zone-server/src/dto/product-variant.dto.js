const { z } = require("zod");

const createProductVariantDto = z.object({
  product_id: z.string().min(1),
  variant_name: z.string().min(1),
  sku: z.string().min(3),
  price: z.number().min(0),
  stock: z.number().min(0).default(0),
  image_url: z.string().optional(),
});

const updateProductVariantDto = z.object({
  variant_name: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  image_url: z.string().optional(),
});

const updateVariantStockDto = z.object({
  stock: z.number().min(0),
});

module.exports = { createProductVariantDto, updateProductVariantDto, updateVariantStockDto };

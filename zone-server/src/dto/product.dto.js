const { z } = require("zod");

const createProductDto = z.object({
  name: z.string().min(2),
  type: z.enum(["SIMPLE", "VARIANT"]),
  sku: z.string().min(3),
  stock: z.number().min(0),
  store_id: z.string().min(1),
  category_id: z.string().min(1),
  regular_price: z.number().min(0),
  price: z.number().min(0),
  tax_class: z.enum(["STANDARD", "GST12", "GST15", "GST18"]).default("STANDARD"),
  tax_status: z.enum(["TAXABLE", "NON_TAXABLE"]).default("TAXABLE"),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
});

const updateProductDto = createProductDto.partial();

const updateStockDto = z.object({
  stock: z.number().min(0),
});

module.exports = { createProductDto, updateProductDto, updateStockDto };

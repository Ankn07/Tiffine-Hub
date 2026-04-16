const { z } = require("zod");

const paginationQueryDto = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const idParamDto = z.object({
  id: z.string().min(1, "ID is required"),
});

module.exports = { paginationQueryDto, idParamDto };

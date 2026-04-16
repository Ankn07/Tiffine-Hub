const { z } = require("zod");

const createStoreUserDto = z.object({
  first_name: z.string().min(2),
  last_name: z.string().optional().default(""),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  address: z.string().optional(),
  role: z.enum(["STORE_MANAGER", "POS"]),
  username: z.string().min(3).toLowerCase(),
  password: z.string().min(6),
  store_id: z.string().min(1),
});

const updateStoreUserDto = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().optional(),
  phone: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  role: z.enum(["STORE_MANAGER", "POS"]).optional(),
});

const storeUserStatusDto = z.object({
  is_published: z.boolean(),
});

module.exports = { createStoreUserDto, updateStoreUserDto, storeUserStatusDto };

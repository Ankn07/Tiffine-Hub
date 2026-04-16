const { z } = require("zod");

const createAdminDto = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

module.exports = { createAdminDto };

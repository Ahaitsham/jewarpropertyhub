const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Public owner sign-up. Role is never accepted from the client — it's
// always forced to OWNER server-side so nobody can self-promote to admin.
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
});

module.exports = { loginSchema, signupSchema };

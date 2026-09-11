const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');
const { loginSchema, signupSchema } = require('../validators/authValidators');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

// Unified login for every role (SUPER_ADMIN, ADMIN, OWNER). The frontend
// routes the person to the right dashboard based on the returned role.
const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return failure(res, 'Invalid email or password.', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return failure(res, 'Invalid email or password.', 401);

  return success(res, { token: signToken(user), user: publicUser(user) });
});

// Public self-service sign-up — always creates an OWNER account.
// If an Owner record already exists with a matching phone number (created
// earlier by an admin adding a property on the owner's behalf), it is
// linked to this new login so the owner immediately sees their listings.
const signup = asyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) return failure(res, 'An account with this email already exists.', 409);

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: 'OWNER',
    },
  });

  // Try to link to an existing, not-yet-claimed Owner record by phone.
  const matchingOwner = await prisma.owner.findFirst({
    where: { phone: data.phone, userId: null },
  });

  if (matchingOwner) {
    await prisma.owner.update({ where: { id: matchingOwner.id }, data: { userId: user.id } });
  } else {
    // No existing owner profile yet — create an empty one so the admin can
    // attach properties to this owner later, and so the owner's dashboard
    // always has a profile to read from.
    await prisma.owner.create({
      data: { fullName: data.name, phone: data.phone, email: data.email, userId: user.id },
    });
  }

  return success(res, { token: signToken(user), user: publicUser(user) }, 201);
});

const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return failure(res, 'Account not found.', 404);
  return success(res, publicUser(user));
});

module.exports = { login, signup, me };

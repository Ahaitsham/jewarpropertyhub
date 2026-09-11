const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');
const { toOwnerPropertyList } = require('../utils/propertyDto');

// GET /api/owner/properties — the logged-in owner's own listings and status.
const getMyProperties = asyncHandler(async (req, res) => {
  const ownerProfile = await prisma.owner.findUnique({ where: { userId: req.user.id } });
  if (!ownerProfile) {
    return success(res, []); // no linked profile yet — nothing to show
  }

  const properties = await prisma.property.findMany({
    where: { ownerId: ownerProfile.id },
    include: { media: true, _count: { select: { enquiries: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return success(res, toOwnerPropertyList(properties));
});

const getMyProfile = asyncHandler(async (req, res) => {
  const ownerProfile = await prisma.owner.findUnique({ where: { userId: req.user.id } });
  if (!ownerProfile) return failure(res, 'No linked owner profile found yet.', 404);
  return success(res, {
    fullName: ownerProfile.fullName,
    phone: ownerProfile.phone,
    email: ownerProfile.email,
  });
});

module.exports = { getMyProperties, getMyProfile };

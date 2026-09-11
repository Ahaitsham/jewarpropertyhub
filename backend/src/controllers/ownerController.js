const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

const listOwners = asyncHandler(async (req, res) => {
  const owners = await prisma.owner.findMany({
    include: { _count: { select: { properties: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, owners);
});

const getOwner = asyncHandler(async (req, res) => {
  const owner = await prisma.owner.findUnique({
    where: { id: req.params.id },
    include: { properties: { include: { media: true } } },
  });
  if (!owner) return failure(res, 'Owner not found.', 404);
  return success(res, owner);
});

const createOwner = asyncHandler(async (req, res) => {
  const owner = await prisma.owner.create({ data: req.body });
  return success(res, owner, 201);
});

const updateOwner = asyncHandler(async (req, res) => {
  const owner = await prisma.owner.update({
    where: { id: req.params.id },
    data: req.body,
  });
  return success(res, owner);
});

module.exports = { listOwners, getOwner, createOwner, updateOwner };

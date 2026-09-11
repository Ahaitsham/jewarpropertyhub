const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');
const { toAdminProperty } = require('../utils/propertyDto');
const { generatePropertyCode, generateUniqueSlug } = require('../utils/propertyId');
const {
  createPropertySchema,
  updatePropertySchema,
} = require('../validators/propertyValidators');

const ADMIN_INCLUDE = {
  media: true,
  owner: true,
  enquiries: { orderBy: { createdAt: 'desc' } },
  activities: { orderBy: { createdAt: 'desc' } },
};

function splitOwnerFields(body) {
  const { ownerId, owner, ...propertyFields } = body;
  return { ownerId, ownerInline: owner, propertyFields };
}

const listAdminProperties = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
  const skip = (page - 1) * limit;

  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.propertyType) where.propertyType = req.query.propertyType;
  if (req.query.keyword) {
    where.OR = [
      { title: { contains: req.query.keyword, mode: 'insensitive' } },
      { propertyCode: { contains: req.query.keyword, mode: 'insensitive' } },
    ];
  }

  const [items, totalItems] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { media: true, owner: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return success(res, items, 200, {
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    totalItems,
  });
});

const getAdminProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: ADMIN_INCLUDE,
  });
  if (!property) return failure(res, 'Property not found.', 404);
  return success(res, toAdminProperty(property));
});

const createProperty = asyncHandler(async (req, res) => {
  const parsed = createPropertySchema.parse(req.body);
  const { ownerId, ownerInline, propertyFields } = splitOwnerFields(parsed);

  if (!ownerId && !ownerInline) {
    return failure(res, 'An owner (existing ownerId or new owner details) is required.', 422);
  }

  let resolvedOwnerId = ownerId;
  if (resolvedOwnerId) {
    const existingOwner = await prisma.owner.findUnique({ where: { id: resolvedOwnerId } });
    if (!existingOwner) return failure(res, 'Selected owner was not found. Please choose again.', 422);
  } else if (ownerInline) {
    const newOwner = await prisma.owner.create({ data: ownerInline });
    resolvedOwnerId = newOwner.id;
  }

  const propertyCode = await generatePropertyCode();
  const slug = await generateUniqueSlug(propertyFields.title);

  const property = await prisma.property.create({
    data: {
      ...propertyFields,
      propertyCode,
      slug,
      ownerId: resolvedOwnerId,
      activities: {
        create: [{ note: `Property ${propertyCode} created.` }],
      },
    },
    include: ADMIN_INCLUDE,
  });

  return success(res, toAdminProperty(property), 201);
});

const updateProperty = asyncHandler(async (req, res) => {
  const parsed = updatePropertySchema.parse(req.body);
  const { ownerId, ownerInline, propertyFields } = splitOwnerFields(parsed);

  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) return failure(res, 'Property not found.', 404);

  let resolvedOwnerId = ownerId;
  if (!resolvedOwnerId && ownerInline) {
    const newOwner = await prisma.owner.create({ data: ownerInline });
    resolvedOwnerId = newOwner.id;
  }

  // Title changes do not change the slug automatically — slugs are SEO
  // surfaces and shouldn't move under an already-shared link. Admin can
  // regenerate deliberately via a future "regenerate slug" action if needed.

  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      ...propertyFields,
      ...(resolvedOwnerId ? { ownerId: resolvedOwnerId } : {}),
    },
    include: ADMIN_INCLUDE,
  });

  return success(res, toAdminProperty(property));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      status,
      ...(status === 'ARCHIVED' ? { archivedAt: new Date() } : {}),
      activities: { create: [{ note: `Status changed to ${status}.` }] },
    },
    include: ADMIN_INCLUDE,
  });
  return success(res, toAdminProperty(property));
});

// Soft delete — archives rather than destroys, per spec section 59
const archiveProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: { status: 'ARCHIVED', archivedAt: new Date() },
  });
  return success(res, property);
});

const addActivityNote = asyncHandler(async (req, res) => {
  const { note } = req.body;
  if (!note || !note.trim()) return failure(res, 'Note text is required.', 422);

  const activity = await prisma.propertyActivity.create({
    data: { propertyId: req.params.id, note: note.trim() },
  });
  return success(res, activity, 201);
});

module.exports = {
  listAdminProperties,
  getAdminProperty,
  createProperty,
  updateProperty,
  updateStatus,
  archiveProperty,
  addActivityNote,
};

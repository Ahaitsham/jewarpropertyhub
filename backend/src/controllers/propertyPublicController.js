const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');
const { toPublicProperty, toPublicPropertyList } = require('../utils/propertyDto');
const { publicListQuerySchema } = require('../validators/propertyValidators');

const PUBLIC_INCLUDE = { media: true };

// Properties that are visible in public search/listing at all.
// SOLD/RENTED/LEASED can still be viewed directly (details page shows
// "no longer available") but are excluded from active search results.
const ACTIVE_STATUSES = ['PUBLISHED'];

function buildOrderBy(sort) {
  switch (sort) {
    case 'price_asc':
      return { publicPrice: 'asc' };
    case 'price_desc':
      return { publicPrice: 'desc' };
    case 'area_asc':
      return { areaValue: 'asc' };
    case 'area_desc':
      return { areaValue: 'desc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

const listProperties = asyncHandler(async (req, res) => {
  const q = publicListQuerySchema.parse(req.query);

  const where = {
    status: { in: ACTIVE_STATUSES },
  };

  if (q.propertyType) where.propertyType = q.propertyType;
  if (q.purpose) where.purpose = q.purpose;
  if (q.featured) where.featured = true;
  if (q.areaUnit) where.areaUnit = q.areaUnit;

  if (q.minPrice || q.maxPrice) {
    where.publicPrice = {};
    if (q.minPrice) where.publicPrice.gte = q.minPrice;
    if (q.maxPrice) where.publicPrice.lte = q.maxPrice;
  }
  if (q.minArea || q.maxArea) {
    where.areaValue = {};
    if (q.minArea) where.areaValue.gte = q.minArea;
    if (q.maxArea) where.areaValue.lte = q.maxArea;
  }

  if (q.location) {
    where.OR = [
      { locality: { contains: q.location, mode: 'insensitive' } },
      { city: { contains: q.location, mode: 'insensitive' } },
      { landmark: { contains: q.location, mode: 'insensitive' } },
      { address: { contains: q.location, mode: 'insensitive' } },
    ];
  }

  if (q.keyword) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { title: { contains: q.keyword, mode: 'insensitive' } },
          { description: { contains: q.keyword, mode: 'insensitive' } },
          { propertyCode: { contains: q.keyword, mode: 'insensitive' } },
          { locality: { contains: q.keyword, mode: 'insensitive' } },
        ],
      },
    ];
  }

  const skip = (q.page - 1) * q.limit;

  const [items, totalItems] = await Promise.all([
    prisma.property.findMany({
      where,
      include: PUBLIC_INCLUDE,
      orderBy: buildOrderBy(q.sort),
      skip,
      take: q.limit,
    }),
    prisma.property.count({ where }),
  ]);

  return success(res, toPublicPropertyList(items), 200, {
    currentPage: q.page,
    totalPages: Math.max(1, Math.ceil(totalItems / q.limit)),
    totalItems,
  });
});

const getPropertyBySlug = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { slug: req.params.slug },
    include: PUBLIC_INCLUDE,
  });

  if (!property || property.status === 'ARCHIVED' || property.status === 'DRAFT') {
    return failure(res, 'Property not found.', 404);
  }

  // Related properties: same type/purpose, excluding this one
  const related = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      status: { in: ACTIVE_STATUSES },
      propertyType: property.propertyType,
      purpose: property.purpose,
    },
    include: PUBLIC_INCLUDE,
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return success(res, {
    property: toPublicProperty(property),
    related: toPublicPropertyList(related),
  });
});

const getFeatured = asyncHandler(async (req, res) => {
  const items = await prisma.property.findMany({
    where: { status: { in: ACTIVE_STATUSES }, featured: true },
    include: PUBLIC_INCLUDE,
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  return success(res, toPublicPropertyList(items));
});

const getRecent = asyncHandler(async (req, res) => {
  const items = await prisma.property.findMany({
    where: { status: { in: ACTIVE_STATUSES } },
    include: PUBLIC_INCLUDE,
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
  return success(res, toPublicPropertyList(items));
});

module.exports = { listProperties, getPropertyBySlug, getFeatured, getRecent };

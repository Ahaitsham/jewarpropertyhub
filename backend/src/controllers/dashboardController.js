const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');

const getStats = asyncHandler(async (req, res) => {
  const [
    total,
    published,
    drafts,
    sold,
    pending,
    newEnquiries,
    totalOwners,
    featured,
    recentProperties,
    recentEnquiries,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'PUBLISHED' } }),
    prisma.property.count({ where: { status: 'DRAFT' } }),
    prisma.property.count({ where: { status: { in: ['SOLD', 'RENTED', 'LEASED'] } } }),
    prisma.property.count({ where: { status: 'PENDING' } }),
    prisma.propertyEnquiry.count({ where: { status: 'NEW' } }),
    prisma.owner.count(),
    prisma.property.count({ where: { featured: true } }),
    prisma.property.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { owner: true } }),
    prisma.propertyEnquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { property: { select: { title: true, propertyCode: true } } },
    }),
  ]);

  return success(res, {
    totals: { total, published, drafts, sold, pending, newEnquiries, totalOwners, featured },
    recentProperties,
    recentEnquiries,
  });
});

module.exports = { getStats };

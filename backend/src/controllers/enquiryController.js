const { z } = require('zod');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

const enquirySchema = z.object({
  propertyId: z.string(),
  name: z.string().min(2),
  phone: z.string().min(8),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().optional(),
  preferredContactTime: z.string().optional(),
});

// Public: submit an enquiry for a property
const createEnquiry = asyncHandler(async (req, res) => {
  const data = enquirySchema.parse(req.body);

  const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
  if (!property) return failure(res, 'Property not found.', 404);

  const enquiry = await prisma.propertyEnquiry.create({
    data: {
      propertyId: data.propertyId,
      name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      message: data.message || null,
      preferredContactTime: data.preferredContactTime || null,
    },
  });

  await prisma.propertyActivity.create({
    data: {
      propertyId: data.propertyId,
      note: `New enquiry received from ${data.name}.`,
    },
  });

  return success(res, { id: enquiry.id }, 201);
});

// Admin: list all enquiries, optionally filtered by status/property
const listEnquiries = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.propertyId) where.propertyId = req.query.propertyId;

  const enquiries = await prisma.propertyEnquiry.findMany({
    where,
    include: { property: { select: { propertyCode: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return success(res, enquiries);
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { status, privateNotes } = req.body;
  const enquiry = await prisma.propertyEnquiry.update({
    where: { id: req.params.id },
    data: {
      ...(status ? { status } : {}),
      ...(privateNotes !== undefined ? { privateNotes } : {}),
    },
  });
  return success(res, enquiry);
});

module.exports = { createEnquiry, listEnquiries, updateEnquiry };

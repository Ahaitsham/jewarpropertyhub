const { z } = require('zod');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

const submissionSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  whatsapp: z.string().optional(),
  propertyType: z.enum([
    'PLOT', 'HOUSE', 'FLAT', 'SHOP', 'OFFICE', 'COMMERCIAL',
    'AGRICULTURAL_LAND', 'FARMHOUSE', 'INDUSTRIAL', 'BUILDING', 'OTHER',
  ]),
  location: z.string().min(2),
  approxArea: z.string().optional(),
  expectedPrice: z.string().optional(),
  description: z.string().optional(),
});

// Public: "List Your Property" submissions — never auto-published
const createSubmission = asyncHandler(async (req, res) => {
  const data = submissionSchema.parse(req.body);
  const submission = await prisma.propertySubmission.create({ data });
  return success(res, { id: submission.id }, 201);
});

const listSubmissions = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  const submissions = await prisma.propertySubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return success(res, submissions);
});

const updateSubmission = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const submission = await prisma.propertySubmission.update({
    where: { id: req.params.id },
    data: {
      ...(status ? { status } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });
  return success(res, submission);
});

module.exports = { createSubmission, listSubmissions, updateSubmission };

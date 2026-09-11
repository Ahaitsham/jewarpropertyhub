const { z } = require('zod');

const PropertyType = z.enum([
  'PLOT', 'HOUSE', 'FLAT', 'SHOP', 'OFFICE', 'COMMERCIAL',
  'AGRICULTURAL_LAND', 'FARMHOUSE', 'INDUSTRIAL', 'BUILDING', 'OTHER',
]);
const PropertyPurpose = z.enum(['SALE', 'RENT', 'LEASE']);
const AreaUnit = z.enum(['GAJ', 'SQFT', 'SQM', 'ACRE', 'HECTARE', 'BIGHA']);
const PropertyStatus = z.enum([
  'DRAFT', 'PUBLISHED', 'PENDING', 'UNDER_DISCUSSION',
  'SOLD', 'RENTED', 'LEASED', 'HIDDEN', 'ARCHIVED',
]);
const VerificationStatus = z.enum([
  'UNVERIFIED', 'CONTACT_VERIFIED', 'DETAILS_VERIFIED',
  'DOCUMENTS_PENDING', 'VERIFIED', 'REJECTED',
]);

// Fields the admin may set when creating a property.
const createPropertySchema = z.object({
  title: z.string().min(5),
  propertyType: PropertyType,
  purpose: PropertyPurpose,
  status: PropertyStatus.optional(),
  verification: VerificationStatus.optional(),
  featured: z.boolean().optional(),

  publicPrice: z.number().nonnegative().optional().nullable(),
  priceOnRequest: z.boolean().optional(),
  negotiable: z.boolean().optional(),

  areaValue: z.number().positive(),
  areaUnit: AreaUnit,
  lengthFt: z.number().nonnegative().optional().nullable(),
  widthFt: z.number().nonnegative().optional().nullable(),

  address: z.string().optional().nullable(),
  locality: z.string().optional().nullable(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  specifications: z.record(z.any()).optional(),
  description: z.string().optional().nullable(),

  seoTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),

  // Private deal info
  ownerAskingPrice: z.number().nonnegative().optional().nullable(),
  minExpectedPrice: z.number().nonnegative().optional().nullable(),
  negotiationFlexibility: z.string().optional().nullable(),
  preferredBuyerType: z.string().optional().nullable(),
  preferredTimeline: z.string().optional().nullable(),
  commissionType: z.string().optional().nullable(),
  commissionPercent: z.number().optional().nullable(),
  commissionFixed: z.number().optional().nullable(),
  paymentStatus: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),

  // Owner: either an existing ownerId or an inline new-owner payload
  ownerId: z.string().optional(),
  owner: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(6),
      alternatePhone: z.string().optional().nullable(),
      whatsapp: z.string().optional().nullable(),
      email: z.string().email().optional().nullable(),
      preferredContact: z.string().optional().nullable(),
      privateNotes: z.string().optional().nullable(),
    })
    .optional(),
});

const updatePropertySchema = createPropertySchema.partial();

const publicListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
  keyword: z.string().optional(),
  location: z.string().optional(),
  propertyType: PropertyType.optional(),
  purpose: PropertyPurpose.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  areaUnit: AreaUnit.optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  furnished: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z
    .enum(['newest', 'price_asc', 'price_desc', 'area_asc', 'area_desc'])
    .default('newest'),
});

module.exports = {
  createPropertySchema,
  updatePropertySchema,
  publicListQuerySchema,
};

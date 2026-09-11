/**
 * THIS FILE IS THE PRIVACY BOUNDARY.
 *
 * Every public-facing property response must be built with toPublicProperty().
 * Never spread a raw Prisma Property object (or its `owner` relation) into a
 * public API response — it contains private deal/owner fields.
 */

function toPublicMedia(media = []) {
  return media
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      displayOrder: m.displayOrder,
      isCover: m.isCover,
    }));
}

function toPublicProperty(property) {
  if (!property) return null;
  return {
    id: property.id,
    propertyCode: property.propertyCode,
    slug: property.slug,
    title: property.title,
    propertyType: property.propertyType,
    purpose: property.purpose,
    status: property.status,
    verification: property.verification,
    featured: property.featured,

    publicPrice: property.publicPrice,
    priceOnRequest: property.priceOnRequest,
    negotiable: property.negotiable,

    areaValue: property.areaValue,
    areaUnit: property.areaUnit,
    lengthFt: property.lengthFt,
    widthFt: property.widthFt,

    address: property.address,
    locality: property.locality,
    city: property.city,
    district: property.district,
    state: property.state,
    pincode: property.pincode,
    landmark: property.landmark,
    latitude: property.latitude,
    longitude: property.longitude,

    specifications: property.specifications,
    description: property.description,

    seoTitle: property.seoTitle,
    metaDescription: property.metaDescription,

    media: toPublicMedia(property.media),

    createdAt: property.createdAt,
    updatedAt: property.updatedAt,

    // Deliberately EXCLUDED: owner (name/phone/email), ownerAskingPrice,
    // minExpectedPrice, negotiationFlexibility, preferredBuyerType,
    // preferredTimeline, commission*, paymentStatus, internalNotes,
    // enquiries, activities.
  };
}

function toPublicPropertyList(properties = []) {
  return properties.map(toPublicProperty);
}

/**
 * Admin view returns everything, including the owner relation and private
 * deal fields. Only ever call this behind requireAdmin middleware.
 */
function toAdminProperty(property) {
  if (!property) return null;
  return {
    ...property,
    media: (property.media || [])
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  };
}

/**
 * Owner view: the owner can see everything a public visitor sees, plus
 * their own status/verification/property-code and the asking-price figures
 * they themselves provided. It deliberately excludes internal admin notes,
 * commission terms, and buyer enquiry contact details — those stay
 * JPH-admin-only.
 */
function toOwnerProperty(property) {
  if (!property) return null;
  return {
    ...toPublicProperty(property),
    status: property.status,
    verification: property.verification,
    ownerAskingPrice: property.ownerAskingPrice,
    minExpectedPrice: property.minExpectedPrice,
    enquiryCount: property.enquiries?.length ?? property._count?.enquiries ?? undefined,
  };
}

function toOwnerPropertyList(properties = []) {
  return properties.map(toOwnerProperty);
}

module.exports = {
  toPublicProperty,
  toPublicPropertyList,
  toAdminProperty,
  toOwnerProperty,
  toOwnerPropertyList,
};

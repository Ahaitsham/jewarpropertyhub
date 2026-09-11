const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'jewar-property-hub', resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Admin: upload one or more files (images/videos) for a property
const uploadMedia = asyncHandler(async (req, res) => {
  const { id: propertyId } = req.params;
  const files = req.files || [];
  if (!files.length) return failure(res, 'No files provided.', 422);

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return failure(res, 'Property not found.', 404);

  const currentCount = await prisma.propertyMedia.count({ where: { propertyId } });
  const hasCover = await prisma.propertyMedia.findFirst({ where: { propertyId, isCover: true } });

  const created = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const type = file.mimetype.startsWith('video') ? 'video' : 'image';
    const result = await uploadBufferToCloudinary(file.buffer, type);

    const media = await prisma.propertyMedia.create({
      data: {
        propertyId,
        url: result.secure_url,
        publicId: result.public_id,
        type: type.toUpperCase(),
        displayOrder: currentCount + i,
        isCover: !hasCover && i === 0,
      },
    });
    created.push(media);
  }

  return success(res, created, 201);
});

const deleteMedia = asyncHandler(async (req, res) => {
  const media = await prisma.propertyMedia.findUnique({ where: { id: req.params.mediaId } });
  if (!media) return failure(res, 'Media not found.', 404);

  await cloudinary.uploader.destroy(media.publicId, {
    resource_type: media.type === 'VIDEO' ? 'video' : 'image',
  });
  await prisma.propertyMedia.delete({ where: { id: media.id } });

  return success(res, { deleted: true });
});

// Body: [{ id, displayOrder }, ...]
const reorderMedia = asyncHandler(async (req, res) => {
  const order = req.body.order || [];
  await Promise.all(
    order.map((item) =>
      prisma.propertyMedia.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );
  return success(res, { reordered: true });
});

const setCover = asyncHandler(async (req, res) => {
  const media = await prisma.propertyMedia.findUnique({ where: { id: req.params.mediaId } });
  if (!media) return failure(res, 'Media not found.', 404);

  await prisma.$transaction([
    prisma.propertyMedia.updateMany({
      where: { propertyId: media.propertyId },
      data: { isCover: false },
    }),
    prisma.propertyMedia.update({ where: { id: media.id }, data: { isCover: true } }),
  ]);

  return success(res, { cover: media.id });
});

module.exports = { uploadMedia, deleteMedia, reorderMedia, setCover };

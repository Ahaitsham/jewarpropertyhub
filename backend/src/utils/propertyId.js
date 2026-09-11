const slugify = require('slugify');
const prisma = require('../config/prisma');

/**
 * Generates the next sequential human-readable property code, e.g. JPH-00001.
 * Uses a simple count-based approach; for very high concurrency you'd want a
 * dedicated sequence table, but this is fine for a brokerage-scale listing volume.
 */
async function generatePropertyCode() {
  const count = await prisma.property.count();
  const next = count + 1;
  return `JPH-${String(next).padStart(5, '0')}`;
}

/**
 * Generates a unique, SEO-friendly slug from a title, appending a short
 * random suffix if the base slug is already taken.
 */
async function generateUniqueSlug(title) {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 80);
  let candidate = base;
  let suffix = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.property.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

module.exports = { generatePropertyCode, generateUniqueSlug };

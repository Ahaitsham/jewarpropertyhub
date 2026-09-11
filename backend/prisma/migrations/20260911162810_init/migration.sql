-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('PLOT', 'HOUSE', 'FLAT', 'SHOP', 'OFFICE', 'COMMERCIAL', 'AGRICULTURAL_LAND', 'FARMHOUSE', 'INDUSTRIAL', 'BUILDING', 'OTHER');

-- CreateEnum
CREATE TYPE "PropertyPurpose" AS ENUM ('SALE', 'RENT', 'LEASE');

-- CreateEnum
CREATE TYPE "AreaUnit" AS ENUM ('GAJ', 'SQFT', 'SQM', 'ACRE', 'HECTARE', 'BIGHA');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PENDING', 'UNDER_DISCUSSION', 'SOLD', 'RENTED', 'LEASED', 'HIDDEN', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'CONTACT_VERIFIED', 'DETAILS_VERIFIED', 'DOCUMENTS_PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT_PLANNED', 'NEGOTIATION', 'CLOSED', 'NOT_INTERESTED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING_REVIEW', 'CONTACTED', 'CONVERTED', 'REJECTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "alternatePhone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "preferredContact" TEXT,
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "propertyCode" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "purpose" "PropertyPurpose" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "verification" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publicPrice" DECIMAL(14,2),
    "priceOnRequest" BOOLEAN NOT NULL DEFAULT false,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "areaValue" DECIMAL(12,2) NOT NULL,
    "areaUnit" "AreaUnit" NOT NULL,
    "lengthFt" DECIMAL(10,2),
    "widthFt" DECIMAL(10,2),
    "address" TEXT,
    "locality" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Jewar',
    "district" TEXT NOT NULL DEFAULT 'Gautam Buddh Nagar',
    "state" TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    "pincode" TEXT,
    "landmark" TEXT,
    "latitude" DECIMAL(10,6),
    "longitude" DECIMAL(10,6),
    "specifications" JSONB,
    "description" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "ownerAskingPrice" DECIMAL(14,2),
    "minExpectedPrice" DECIMAL(14,2),
    "negotiationFlexibility" TEXT,
    "preferredBuyerType" TEXT,
    "preferredTimeline" TEXT,
    "commissionType" TEXT,
    "commissionPercent" DECIMAL(5,2),
    "commissionFixed" DECIMAL(12,2),
    "paymentStatus" TEXT,
    "internalNotes" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyEnquiry" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "message" TEXT,
    "preferredContactTime" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyActivity" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertySubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "propertyType" "PropertyType" NOT NULL,
    "location" TEXT NOT NULL,
    "approxArea" TEXT,
    "expectedPrice" TEXT,
    "description" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_userId_key" ON "Owner"("userId");

-- CreateIndex
CREATE INDEX "Owner_phone_idx" ON "Owner"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Property_propertyCode_key" ON "Property"("propertyCode");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_purpose_idx" ON "Property"("purpose");

-- CreateIndex
CREATE INDEX "Property_city_locality_idx" ON "Property"("city", "locality");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_idx" ON "PropertyMedia"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyEnquiry_propertyId_idx" ON "PropertyEnquiry"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyEnquiry_status_idx" ON "PropertyEnquiry"("status");

-- CreateIndex
CREATE INDEX "PropertyActivity_propertyId_idx" ON "PropertyActivity"("propertyId");

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyEnquiry" ADD CONSTRAINT "PropertyEnquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyActivity" ADD CONSTRAINT "PropertyActivity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

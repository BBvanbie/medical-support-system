-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'ACCEPTABLE', 'DECLINED', 'ACCEPTABLE_WITH_CONDITIONS', 'CONSULT_REQUIRED', 'TRANSPORT_DECIDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."MessageSender" AS ENUM ('EMS', 'HOSPITAL');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('ADDITIONAL_INFO', 'QUESTION', 'CONDITION', 'NOTE');

-- CreateTable
CREATE TABLE "public"."Case" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "purgeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaseVital" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "copiedFromVitalId" TEXT,
    "measuredAt" TIMESTAMP(3),
    "jcs" INTEGER NOT NULL,
    "gcsE" INTEGER,
    "gcsV" INTEGER,
    "gcsM" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseVital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SymptomChestPain" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "present" BOOLEAN,
    "location" TEXT,
    "quality" TEXT,
    "nrs" TEXT,
    "migrated" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomChestPain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SymptomParesis" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "present" BOOLEAN,
    "bodyPart" TEXT,
    "laterality" TEXT,
    "severity" TEXT,
    "onsetPattern" TEXT,
    "progression" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomParesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CasePatient" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "name" TEXT,
    "isNameUnknown" BOOLEAN NOT NULL DEFAULT false,
    "birthDate" TEXT,
    "isBirthUnknown" BOOLEAN NOT NULL DEFAULT false,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "address" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CasePatient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HospitalDepartment" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HospitalDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HospitalRequest" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "conditionsText" TEXT,
    "conditionsAck" BOOLEAN NOT NULL DEFAULT false,
    "conditionsAckAt" TIMESTAMP(3),
    "decisionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestMessage" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "sender" "public"."MessageSender" NOT NULL,
    "messageType" "public"."MessageType" NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseVital_caseId_idx" ON "public"."CaseVital"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseVital_caseId_sequence_key" ON "public"."CaseVital"("caseId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomChestPain_caseId_key" ON "public"."SymptomChestPain"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomParesis_caseId_key" ON "public"."SymptomParesis"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "CasePatient_caseId_key" ON "public"."CasePatient"("caseId");

-- CreateIndex
CREATE INDEX "Hospital_prefecture_city_idx" ON "public"."Hospital"("prefecture", "city");

-- CreateIndex
CREATE INDEX "Hospital_name_idx" ON "public"."Hospital"("name");

-- CreateIndex
CREATE INDEX "HospitalDepartment_department_idx" ON "public"."HospitalDepartment"("department");

-- CreateIndex
CREATE INDEX "HospitalDepartment_hospitalId_idx" ON "public"."HospitalDepartment"("hospitalId");

-- CreateIndex
CREATE INDEX "HospitalRequest_caseId_idx" ON "public"."HospitalRequest"("caseId");

-- CreateIndex
CREATE INDEX "HospitalRequest_hospitalId_idx" ON "public"."HospitalRequest"("hospitalId");

-- CreateIndex
CREATE INDEX "RequestMessage_requestId_createdAt_idx" ON "public"."RequestMessage"("requestId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."CaseVital" ADD CONSTRAINT "CaseVital_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseVital" ADD CONSTRAINT "CaseVital_copiedFromVitalId_fkey" FOREIGN KEY ("copiedFromVitalId") REFERENCES "public"."CaseVital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SymptomChestPain" ADD CONSTRAINT "SymptomChestPain_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SymptomParesis" ADD CONSTRAINT "SymptomParesis_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CasePatient" ADD CONSTRAINT "CasePatient_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HospitalDepartment" ADD CONSTRAINT "HospitalDepartment_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "public"."Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HospitalRequest" ADD CONSTRAINT "HospitalRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HospitalRequest" ADD CONSTRAINT "HospitalRequest_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "public"."Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestMessage" ADD CONSTRAINT "RequestMessage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."HospitalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

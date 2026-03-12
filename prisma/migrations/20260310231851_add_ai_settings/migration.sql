-- CreateTable
CREATE TABLE "AiSettings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'amigável',
    "goal" TEXT NOT NULL DEFAULT 'qualificar leads e encaminhar para closer',
    "extraInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiSettings_pkey" PRIMARY KEY ("id")
);

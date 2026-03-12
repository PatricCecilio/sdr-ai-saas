-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "budgetInfo" TEXT,
ADD COLUMN     "handoffStatus" TEXT DEFAULT 'PENDENTE',
ADD COLUMN     "interestLevel" TEXT,
ADD COLUMN     "leadTemperature" TEXT,
ADD COLUMN     "mainInterest" TEXT,
ADD COLUMN     "qualifiedSummary" TEXT,
ADD COLUMN     "timelineInfo" TEXT;

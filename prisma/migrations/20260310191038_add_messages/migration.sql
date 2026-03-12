-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_leadId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Records" DROP CONSTRAINT "Records_documentId_fkey";

-- DropTable
DROP TABLE "Records";

-- DropTable
DROP TABLE "document";

-- CreateTable
CREATE TABLE "Docs" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Docs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

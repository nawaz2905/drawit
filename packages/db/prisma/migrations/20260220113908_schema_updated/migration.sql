-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'Email',
ALTER COLUMN "password" DROP NOT NULL;

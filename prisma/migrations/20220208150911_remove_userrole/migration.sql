/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserRole_userId_roleId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserRole";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Role" (
    "value" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

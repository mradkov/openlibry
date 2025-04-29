/*
  Warnings:

  - You are about to drop the column `minPlayers` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `schoolGrade` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `schoolTeacherName` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rentalStatus" TEXT NOT NULL DEFAULT 'available',
    "rentedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME,
    "renewalCount" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "author" TEXT NOT NULL,
    "topics" TEXT,
    "imageLink" TEXT,
    "isbn" TEXT,
    "editionDescription" TEXT,
    "publisherLocation" TEXT,
    "pages" INTEGER,
    "summary" TEXT,
    "publisherName" TEXT,
    "otherPhysicalAttributes" TEXT,
    "supplierComment" TEXT,
    "publisherDate" TEXT,
    "physicalSize" TEXT,
    "minAge" TEXT,
    "maxAge" TEXT,
    "additionalMaterial" TEXT,
    "price" TEXT,
    "externalLinks" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("additionalMaterial", "author", "createdAt", "dueDate", "editionDescription", "externalLinks", "id", "imageLink", "isbn", "maxAge", "minAge", "otherPhysicalAttributes", "pages", "physicalSize", "price", "publisherDate", "publisherLocation", "publisherName", "renewalCount", "rentalStatus", "rentedDate", "subtitle", "summary", "supplierComment", "title", "topics", "updatedAt", "userId") SELECT "additionalMaterial", "author", "createdAt", "dueDate", "editionDescription", "externalLinks", "id", "imageLink", "isbn", "maxAge", "minAge", "otherPhysicalAttributes", "pages", "physicalSize", "price", "publisherDate", "publisherLocation", "publisherName", "renewalCount", "rentalStatus", "rentedDate", "subtitle", "summary", "supplierComment", "title", "topics", "updatedAt", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE TABLE "new_User" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "phone" TEXT,
    "eMail" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("active", "createdAt", "eMail", "firstName", "id", "lastName", "updatedAt") SELECT "active", "createdAt", "eMail", "firstName", "id", "lastName", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT 'Не е въведен',
    "eMail" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("active", "createdAt", "eMail", "firstName", "id", "lastName", "phone", "updatedAt") SELECT "active", "createdAt", "eMail", "firstName", "id", "lastName", coalesce("phone", 'Не е въведен') AS "phone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

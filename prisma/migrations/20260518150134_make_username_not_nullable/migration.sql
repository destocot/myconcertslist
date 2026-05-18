/*
  Warnings:

  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "username" TEXT NOT NULL,
    "display_username" TEXT
);
INSERT INTO "new_users" ("created_at", "display_username", "email", "email_verified", "id", "image", "name", "updated_at", "username") SELECT "created_at", "display_username", "email", "email_verified", "id", "image", "name", "updated_at", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

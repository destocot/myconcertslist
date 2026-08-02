/*
  Warnings:

  - Added the required column `updated_at` to the `openers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_concerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "headliner" TEXT NOT NULL,
    "tour_name" TEXT,
    "venue" TEXT,
    "performed_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "favorited_at" DATETIME,
    "profile_id" TEXT NOT NULL,
    CONSTRAINT "concerts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_concerts" ("created_at", "favorited_at", "headliner", "id", "performed_at", "profile_id", "status", "tour_name", "updated_at", "venue") SELECT "created_at", "favorited_at", "headliner", "id", "performed_at", "profile_id", "status", "tour_name", "updated_at", "venue" FROM "concerts";
DROP TABLE "concerts";
ALTER TABLE "new_concerts" RENAME TO "concerts";
CREATE INDEX "concerts_profile_id_idx" ON "concerts"("profile_id");
CREATE TABLE "new_openers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "concert_id" TEXT NOT NULL,
    CONSTRAINT "openers_concert_id_fkey" FOREIGN KEY ("concert_id") REFERENCES "concerts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_openers" ("concert_id", "id", "name", "created_at", "updated_at") SELECT "concert_id", "id", "name", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "openers";
DROP TABLE "openers";
ALTER TABLE "new_openers" RENAME TO "openers";
CREATE INDEX "openers_concert_id_idx" ON "openers"("concert_id");
CREATE TABLE "new_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL DEFAULT 'blue',
    "gender" TEXT,
    "birthday" DATETIME,
    "location" TEXT,
    "bio" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_profiles" ("bio", "birthday", "created_at", "gender", "id", "is_public", "location", "theme", "updated_at", "user_id") SELECT "bio", "birthday", "created_at", "gender", "id", "is_public", "location", "theme", "updated_at", "user_id" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

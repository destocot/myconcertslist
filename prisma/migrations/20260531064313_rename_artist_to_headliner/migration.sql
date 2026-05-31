-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_concerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "headliner" TEXT NOT NULL,
    "venue" TEXT,
    "performed_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "profile_id" TEXT NOT NULL,
    CONSTRAINT "concerts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_concerts" ("created_at", "id", "performed_at", "profile_id", "status", "updated_at", "venue", "headliner") SELECT "created_at", "id", "performed_at", "profile_id", "status", "updated_at", "venue", "artist" FROM "concerts";
DROP TABLE "concerts";
ALTER TABLE "new_concerts" RENAME TO "concerts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

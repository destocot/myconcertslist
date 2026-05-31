-- CreateTable
CREATE TABLE "openers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "concert_id" TEXT NOT NULL,
    CONSTRAINT "openers_concert_id_fkey" FOREIGN KEY ("concert_id") REFERENCES "concerts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

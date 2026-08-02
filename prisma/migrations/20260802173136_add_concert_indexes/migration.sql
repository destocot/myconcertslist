-- CreateIndex
CREATE INDEX "concerts_profile_id_idx" ON "concerts"("profile_id");

-- CreateIndex
CREATE INDEX "openers_concert_id_idx" ON "openers"("concert_id");

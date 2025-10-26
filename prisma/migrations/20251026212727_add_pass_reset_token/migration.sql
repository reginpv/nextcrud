-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "token" VARCHAR(191) NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idx_30320_primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idx_30320_resetpasswordtoken_token_key" ON "ResetPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "idx_30320_resetpasswordtoken_email_token_key" ON "ResetPasswordToken"("email", "token");

-- CreateIndex
CREATE INDEX "User_email_deletedAt_idx" ON "User"("email", "deletedAt");

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadataUri" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectId_key" ON "Project"("projectId");

-- CreateIndex
CREATE INDEX "projectId" ON "Project"("projectId");

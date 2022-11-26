-- AlterTable
CREATE SEQUENCE "project_id_seq";
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT nextval('project_id_seq');
ALTER SEQUENCE "project_id_seq" OWNED BY "Project"."id";

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type Database = PrismaClient;

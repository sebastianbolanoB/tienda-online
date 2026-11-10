import { PrismaClient } from "@prisma/client";

// en desarrollo next recarga los modulos y se abrian muchas conexiones
const g = globalThis as any;

export const prisma: PrismaClient = g.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") g.prisma = prisma;

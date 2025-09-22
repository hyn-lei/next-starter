import { PrismaClient } from '@prisma/client';

// 声明全局类型
declare global {
  var prisma: PrismaClient | undefined;
}

// 防止在开发环境中创建多个PrismaClient实例
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

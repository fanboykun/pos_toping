import { PrismaClient } from '@prisma/client'

export const load = async () => {
    const prisma = new PrismaClient()
    const products = await prisma.product.findMany({
        include: { category: true }
    })
    const topings = await prisma.toping.findMany()
    return { products, topings }
}
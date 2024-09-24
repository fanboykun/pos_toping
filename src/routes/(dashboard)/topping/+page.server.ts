import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const load = async () => {
    const toppings = await prisma.toping.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return { toppings }
}
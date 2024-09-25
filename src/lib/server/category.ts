import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const getAllCategory = async () => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {createdAt: 'desc'},
        })
        return categories
    } catch(err) {
        console.log(err)
        return null
    }
}
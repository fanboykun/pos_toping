import { Prisma } from "@prisma/client"
import { prisma } from "$lib/server/db"


// const prisma = new PrismaClient()

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

export const getAllCategoryWithProductCount = async () => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { products: true }
                }
            }
        })
        return categories
    } catch(err) {
        console.log(err)
        return null
    }
}

export const addNewCategory = async (data: Prisma.CategoryCreateInput) => {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name
            }
        })
        return category
    } catch(err) {
        console.log(err)
        return null
    }
}

export const updateCategory = async (data: Required<Pick<Prisma.CategoryCreateInput, 'id'>> & Omit<Prisma.CategoryCreateInput, 'id'>) => {
    try {
        const category = await prisma.category.update({
            data: {
                name: data.name
            },
            where: {
                id: data.id
            }
        })
        return category
    } catch(err) {
        console.log(err)
        return null
    }
}

export const deleteCategory = async (toppingId: string) => {
    try {
        await prisma.category.delete({
            where: { id: toppingId }
        })
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}


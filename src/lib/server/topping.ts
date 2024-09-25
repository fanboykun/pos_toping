import { Prisma, PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const getAllTopping = async () => {
    try {
        const toppings = await prisma.toping.findMany({
            orderBy: {createdAt: 'desc'},
        })
        return toppings
    } catch(err) {
        console.log(err)
        return null
    }
}

export const addNewTopping = async (data: Prisma.TopingCreateInput) => {
    try {
        const topping = await prisma.toping.create({
            data: data
        })
        return topping
    } catch(err) {
        console.log(err)
        return null
    }
}

export const updateTopping = async (data: Required<Pick<Prisma.TopingCreateInput, 'id'>> & Omit<Prisma.TopingCreateInput, 'id'>) => {
    try {
        const topping = await prisma.toping.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                price: data.price
            }
        })
        return topping
    } catch(err) {
        console.log(err)
        return null
    }
}

export const deleteTopping = async (toppingId: string) => {
    try {
        await prisma.toping.delete({
            where: { id: toppingId }
        })
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}



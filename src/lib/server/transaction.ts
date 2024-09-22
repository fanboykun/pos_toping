import type { MakeTransaction } from '$lib/transaction'
import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllTransaction = async () => {
    const transactions = await prisma.transaction.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            productTransaction: {
                include: {
                    product: true,
                    productTopingTransaction: {
                        include: {
                            toping: true
                        }
                    }
                }
            }
        }
    })
    return transactions
}

export const saveTransaction = async (data: MakeTransaction) => {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                total_price: data.total_price,
                productTransaction: {
                    create: data.products.map(product => ({
                            productId: product.id, // Foreign key to the Product table
                            quantity: product.quantity,
                            total: product.total_price, // Total product price including toppings
                            productTopingTransaction: {
                                create: product.topings.map(topping => ({
                                    topingId: topping.id, // Foreign key to the Toping table
                                    quantity: topping.quantity,
                                    total: topping.total_price, // Total topping price
                                }))
                            }
                    }))
                }
            }
        })
        return transaction
    } catch(err) {
        console.log(err)
        return null
    }
}

export type TrasactionWithProductWithToping = Prisma.PromiseReturnType<typeof getAllTransaction>
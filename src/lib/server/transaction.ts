import type { MakeTransaction } from '$lib/transaction'
import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export type TrasactionWithProductWithToping = Prisma.PromiseReturnType<typeof getAllTransaction>

export const getAllTransaction = async ( skip: number = 0, take: number|undefined = undefined ) => {
    const transactionInclude = {
        user: {
            select: {
                id: true,
                name: true,
                email:true
            }
        },
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
    const transactionGetLimit = {
        skip: skip,
        take: take,
    }
    if (take == undefined) delete transactionGetLimit.take

    const transactions = await prisma.transaction.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: { ...transactionInclude },
        ...transactionGetLimit
    })
    return transactions
}

export const getTransactionsCount = async () => {
    try {
        return await prisma.transaction.count()
    } catch(err) {
        console.log(err)
        return 0
    }
}

export const saveTransaction = async (data: MakeTransaction) => {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                userId: data.userId,
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

export const updateTransaction = async (transactionId: string, validatedData: MakeTransaction) => {
    try {
        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
              total_price: validatedData.total_price,
              
              // Step 5: Manage product transactions (update, create, or disconnect)
              productTransaction: {
                upsert: validatedData.products.map((product) => ({
                  where: { id: product.temp_id },  // Using temp_id or unique id for upsert
                  update: {
                    quantity: product.quantity,
                    total: product.total_price,
                    productTopingTransaction: {
                      upsert: product.topings.map((topping) => ({
                        where: { id: topping.id }, // Use primary key to identify toppings
                        update: {
                          quantity: topping.quantity,
                          total: topping.total_price,
                        },
                        create: {
                          topingId: topping.id,
                          quantity: topping.quantity,
                          total: topping.total_price,
                        },
                      })),
                    },
                  },
                  create: {
                    productId: product.id,
                    quantity: product.quantity,
                    total: product.total_price,
                    productTopingTransaction: {
                      create: product.topings.map((topping) => ({
                        topingId: topping.id,
                        quantity: topping.quantity,
                        total: topping.total_price,
                      })),
                    },
                  },
                })),
                // Step 6: Detach old product relations that are no longer selected
                deleteMany: {
                  id: { notIn: validatedData.products.map((p) => p.temp_id) }, // Only keep existing products in the new data },
                },
              },
            },
          });
        return transaction
    } catch(err) {
        console.log(err)
        return null
    }
}

export const deleteTransaction = async (transactionId: string) => {
    try {
        await prisma.transaction.delete({
            where: {
                id: transactionId
            }
        })
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

export const findTransactionWithProductAndToping = async (transactionId: string) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            },
            include: {
                productTransaction: {
                  include: {
                    productTopingTransaction: true,
                  },
                },
            },
        })
        return transaction
    } catch(err) {
        console.log(err)
        return null
    }
}

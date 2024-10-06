import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid'
import type { MakeTransaction, MakeTransactionProduct, MakeTransactionToping } from '../src/lib/transaction'
// import { prisma } from '../src/lib/server/db'
import { Argon2id } from 'oslo/password';

const prisma = new PrismaClient()

type DummyCategory = {
    id: string,
    name: string
}

type DummyProduct = {
    id: string,
    categoryId: string,
    name: string,
    price: number,
}

type DummyToping = {
    id: string,
    name: string,
    price: number,
}

async function main() {

    const user = await insertUser()

    await prisma.category.deleteMany()
    const dummyCategories = createDummyCategory()
    const categories = await prisma.category.createMany({
        data: dummyCategories
    })
    if(!categories) return

    await prisma.product.deleteMany()
    const dummyProducts = createDummyProducts(dummyCategories)
    const products = await prisma.product.createMany({
        data: dummyProducts
    })
    if(!products) return

    await prisma.toping.deleteMany()
    const dummyTopings = createDummyTopings()
    const topings = await prisma.toping.createMany({
        data: dummyTopings
    })
    if(!topings) return

    await prisma.transaction.deleteMany()
    const dummyTransaction = createDummyTransaction(dummyProducts, dummyTopings)
    const transaction =  await prisma.transaction.create({
        data: {
            total_price: dummyTransaction.total_price,
            userId: user.id
        }
    })
    if(!transaction) return

    for (const product of dummyTransaction.products) {
        const productTransaction = await prisma.productTransaction.create({
            data: {
                transactionId: transaction.id,
                productId: product.id,
                quantity: product.quantity,
                total: product.total_price,
            }
        })
        if(!productTransaction) return
        for (const toping of product.topings) {
            const productTopingTransaction = await prisma.productTopingTransaction.create({
                data: {
                    productTransactionId: productTransaction.id,
                    topingId: toping.id,
                    quantity: toping.quantity,
                    total: toping.total_price,
                }
            })
            if(!productTopingTransaction) return
        }
    }
}

const createDummyProducts = (categories: DummyCategory[]) => {
    const products: DummyProduct[] =  []
    for (const cat of categories) {
        const p: DummyProduct = {
            id: uuid(),
            name: faker.food.dish(),
            price: Number(faker.commerce.price({ min: 5000, max: 20000, dec: 0 })),
            categoryId: cat.id
        }
        products.push(p)
    }
    return products
}

const createDummyCategory = (howMuch: number = 10) => {
    const categories: DummyCategory[] =  []
    for (let i = 0; i < howMuch; i++) {
        const data: DummyCategory = {
            id: uuid(),
            name: faker.food.adjective(),
        }
        categories.push(data)
    }
    return categories
}

const createDummyTopings = (howMuch: number = 10) => {
    const topings: DummyToping[] = []
    for (let i = 0; i < howMuch; i++) {
        const t: DummyToping = {
            id: uuid(),
            name: faker.food.vegetable(),
            price: Number(faker.commerce.price({ min: 2000, max: 5000, dec: 0 })),
        }
        topings.push(t)
    }
    return topings
}

const createDummyTransaction = (products: DummyProduct[], topings: DummyToping[]) => {
    const transaction: MakeTransaction = {
        total_price: 0,
        products: []
    }
    for(let i = 0; i < products.length; i++){
        const selectedRandomProduct = getRandomItem(products)
        const selectedProduct: MakeTransactionProduct = {
            temp_id: uuid(),
            id: selectedRandomProduct.id,
            quantity: 1,
            price: selectedRandomProduct.price,
            topings: [],
            total_price: selectedRandomProduct.price * 1
        }
        const topingsAmount = faker.number.int({ min: 0, max: 2 })
        if(topingsAmount > 0) {
            for(let i = 0; i < topingsAmount; i++){
                const randomQty = faker.number.int({ min: 1, max: 2 })
                const selectedRandomToping = getRandomItem(topings)
                const selectedTopings: MakeTransactionToping = {
                    id: selectedRandomToping.id,
                    quantity: randomQty,
                    price: selectedRandomToping.price,
                    total_price: selectedRandomToping.price * randomQty
                }
                selectedProduct.topings.push(selectedTopings)
                selectedProduct.total_price += selectedTopings.total_price
            }
        }

        transaction.products.push(selectedProduct)
        transaction.total_price += selectedProduct.total_price
    }
    return transaction
}

function getRandomItem<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const insertUser = async () => {
    // equal to password   (the password is password) 
    const hashed_password = await new Argon2id().hash('password')
    const email = 'admin@gmail.com'

    const user = await prisma.user.upsert({
    where: { email: email },
    update: {
        password: hashed_password,
    },
    create: {
        name: 'Admin',
        email: email,
        isAdmin: true,
        password: hashed_password,
    },
    });
    return user
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
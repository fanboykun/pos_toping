import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()
export type AllProductWithCategory = Prisma.PromiseReturnType<typeof getAllProductWithCategory>
export type ProductWithCategory = Prisma.PromiseReturnType<typeof getProductWithCategory>
export type ProductsGroupedByCategory = Prisma.PromiseReturnType<typeof getProductsGroupedByCategory>


export const getAllProductWithCategory = async () => {
    try {
        const products = await prisma.product.findMany({
            orderBy: {createdAt: 'desc'},
            include: { category: true }
        })
        return products
    } catch(err) {
        console.log(err)
        return null
    }
}

export const getProductsGroupedByCategory = async () => {
    try {
        const categoriesWithProducts = await prisma.category.findMany({
            include: {
              products: true, // Include all related products in the result
            },
          });
        
          // Group products by category
          const groupedProducts = categoriesWithProducts.map(category => ({
            categoryId: category.id,
            categoryName: category.name,
            products: category.products, // The array of products within this category
          }));
        
          return groupedProducts;
    } catch(err) {
        console.log(err)
        return []
    }
}

export const getProductWithCategory = async ( productId: string ) => {
    try {
        const products = await prisma.product.findUnique({
            include: { category: true },
            where: {
                id: productId
            }
        })
        return products
    } catch(err) {
        console.log(err)
        return null
    }
}

export const addNewProduct = async (input: { name: string, price: number, categoryId: string }) => {
    try {
        const product = await prisma.product.create({
            data: {
                name: input.name,
                price: input.price,
                categoryId: input.categoryId
            }
        })
        return product
    } catch (err) {
        console.log(err)
        return null
    }
}

export const updateProduct = async (input: { id: string, name: string, price: number, categoryId: string }) => {
    try {
        const product = await prisma.product.update({
            data: {
                name: input.name,
                price: input.price,
                categoryId: input.categoryId
            },
            where: {
                id: input.id
            }
        })
        return product
    } catch (err) {
        console.log(err)
        return null
    }
}

export const deleteProduct = async (productId: string) => {
    try {
        await prisma.product.delete({
           where: {
            id: productId
           }
        })
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

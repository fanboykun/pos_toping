import { saveTransaction } from '$lib/server/transaction'
import type { MakeTransaction } from '$lib/transaction'
import { PrismaClient } from '@prisma/client'
import type { Action, Actions } from '@sveltejs/kit'
const prisma = new PrismaClient()

export const load = async () => {
    const products = await prisma.product.findMany({
        include: { category: true }
    })
    const topings = await prisma.toping.findMany()
    return { products, topings }
}
const addTransaction: Action = async (event) => {
    const form = await event.request.formData()
    const stringData = form.get('data')
    let data: MakeTransaction|undefined

    try {
        data = JSON.parse(String(stringData)) ?? undefined as MakeTransaction|undefined
    } catch(err) {
        console.log(err)
        return { message: 'error' }
    }
    if(!data) return { message: 'error' }

    try {
        const validatedMakeTransactionData = await validateAndRecalculateTransaction(data)
        const transaction = await saveTransaction(validatedMakeTransactionData)
        return { transaction, message: 'success' }
    } catch(err) {
        console.log(err)
        return { message: 'error' }
    }

}

// Function to extract unique product and topping IDs from transaction data
const extractUniqueIds = (transactionData: MakeTransaction) => {
    const productIds = new Set<string>();
    const toppingIds = new Set<string>();

    transactionData.products.forEach(product => {
        productIds.add(product.id); // Add product ID to Set

        // Add all unique topping IDs to Set
        product.topings.forEach(topping => {
            toppingIds.add(topping.id);
        });
    });

    return {
        uniqueProductIds: Array.from(productIds), // Convert Set back to Array
        uniqueToppingIds: Array.from(toppingIds)  // Convert Set back to Array
    };
}

const validateAndRecalculateTransaction = async (transactionData: MakeTransaction): Promise<MakeTransaction> => {
    const { uniqueProductIds, uniqueToppingIds } = extractUniqueIds(transactionData);

    // Fetch products and toppings from the database
    const productsFromDb = await prisma.product.findMany({
        where: { id: { in: uniqueProductIds } },
        select: { id: true, price: true }
    });

    const toppingsFromDb = await prisma.toping.findMany({
        where: { id: { in: uniqueToppingIds } },
        select: { id: true, price: true }
    });

    const productPriceMap = new Map(productsFromDb.map(p => [p.id, p.price]));
    const toppingPriceMap = new Map(toppingsFromDb.map(t => [t.id, t.price]));

    // Identify missing products and toppings
    const missingProductIds = uniqueProductIds.filter(id => !productPriceMap.has(id));
    const missingToppingIds = uniqueToppingIds.filter(id => !toppingPriceMap.has(id));

    // Filter out products and toppings with missing IDs and recalculate prices
    const cleanedTransactionData = {
        ...transactionData,
        products: transactionData.products
            .filter(product => !missingProductIds.includes(product.id))
            .map(product => {
                const validProductPrice = productPriceMap.get(product.id) || 0;

                // Recalculate the total price for the product, including toppings
                const updatedTopings = product.topings
                    .filter(topping => !missingToppingIds.includes(topping.id))
                    .map(topping => {
                        const validToppingPrice = toppingPriceMap.get(topping.id) || 0;
                        return {
                            ...topping,
                            price: validToppingPrice, // Use price from DB
                            total_price: validToppingPrice * topping.quantity // Recalculate total price
                        };
                    });

                // Calculate product total price including toppings
                const totalTopingsPrice = updatedTopings.reduce((sum, t) => sum + t.total_price, 0);
                const updatedProductTotalPrice = (validProductPrice * product.quantity) + totalTopingsPrice;

                return {
                    ...product,
                    price: validProductPrice, // Use price from DB
                    total_price: updatedProductTotalPrice, // Recalculate total price
                    topings: updatedTopings
                };
            })
    };

    // Recalculate the total price for the entire transaction
    cleanedTransactionData.total_price = cleanedTransactionData.products.reduce(
        (sum, product) => sum + product.total_price, 
        0
    );

    // Now you can safely insert `cleanedTransactionData` into the database
    return cleanedTransactionData;
}


export const actions: Actions = { addTransaction }
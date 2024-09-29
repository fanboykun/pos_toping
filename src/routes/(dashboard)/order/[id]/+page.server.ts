import * as TransactionFunction from '$lib/server/transaction.js';
import { getProductsGroupedByCategory } from '$lib/server/product.js'
import { getAllTopping } from '$lib/server/topping.js'
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import type { MakeTransaction } from '$lib/transaction.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const load = async ( { locals, params } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const transactionId = params.id
    if(!transactionId) return redirect(300, '/order')
        
    const transaction = await TransactionFunction.findTransactionWithProductAndToping(transactionId)
    if(!transaction) return redirect(300, '/order')

    const [productsGroupedByCategory, topings] = [getProductsGroupedByCategory(), getAllTopping()]
    return { transaction, productsGroupedByCategory, topings }
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

const editTransaction: Action = async ( { request } ) => {
    const form = await request.formData()
    const stringData = form.get('data')
    const transactionId = String(form.get('transactionId'))
    let data: MakeTransaction|undefined

    // parse MakeTransaction from the form (not the best way, but will do)
    try {
        data = JSON.parse(String(stringData)) ?? undefined as MakeTransaction|undefined
    } catch(err) {
        console.log(err)
        return fail(401, { message: 'Form is invalid', success: false })
    }
    if(!data || !transactionId) return fail(401, { message: 'Form is invalid', success: false })

    // Validate and recalculate product and topping prices from the database
    const validatedData = await validateAndRecalculateTransaction(data);

    // Fetch the existing transaction with all product and topping relations
    const existingTransaction = await TransactionFunction.findTransactionWithProductAndToping(transactionId)
    if(!existingTransaction) return fail(401, { message: 'Transaction could not been found!', success: false })
        
    // console.log("Products to retain:", validatedData.products.map(p => p.temp_id));
    // console.log({ ...validatedData })

    // check the existing products in the transaction in case they are removed from the transaction
    const existingProductTransactions = await prisma.productTransaction.findMany({
        where: { transactionId },
        select: { id: true, productId: true },
    });
    const existingProductIds = existingProductTransactions.map(pt => pt.id);

    const transaction = await TransactionFunction.updateTransaction(transactionId, validatedData, existingProductIds);
    if(!transaction) return fail(401, { message: 'Error While Updating Transaction', data: validatedData, success: false })
    return {
        message: 'Transaction updated successfully',
        success: true,
    }

}

export const actions: Actions = { editTransaction }

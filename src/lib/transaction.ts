import type { Product, Toping } from "@prisma/client"
import { writable, type Writable } from "svelte/store"

export type MakeTransactionToping = {
    id: string,
    name?: string,
    quantity: number,
    price: number,
    total_price: number,
}

export type MakeTransactionProduct = {
    temp_id: string,
    id: string,
    name?: string,
    quantity: number,
    price: number,
    total_price: number,
    topings: MakeTransactionToping[]
}
export type MakeTransaction = {
    userId?: string,
    products: MakeTransactionProduct[],
    total_price: number
}
export const makeTransaction: Writable<MakeTransaction> = writable({
    userId: undefined,
    total_price: 0,
    products: []
})

// Function to update or add a product and recalculate total prices
export function updateOrAddProduct(temp_id: string, selectedProduct: Product|MakeTransactionProduct, addition: boolean = true, newQuantity?: number) {
    makeTransaction.update((transaction) => {
        const productIndex = transaction.products.findIndex(p => p.temp_id === temp_id);

        if (productIndex !== -1) {
            // Product found, update its quantity and price
            const product = transaction.products[productIndex];
            if(addition){
                if(newQuantity){ product.quantity = newQuantity }
                else { product.quantity++; }
            }else {
                if(newQuantity != undefined){ product.quantity = newQuantity }
                else { product.quantity--; }
            }

            if (selectedProduct.price !== undefined) {
                product.price = selectedProduct.price;
            }

            // If the quantity is less than 1, remove the product
            if (product.quantity < 1) {
                transaction.products.splice(productIndex, 1); // Remove product from products array
            } else {
               // Recalculate total_price for the product
               const baseProductPrice = product.price * product.quantity;

               // Calculate the total price of all toppings, scaled by product quantity
               const totalToppingsPrice = product.topings.reduce(
                   (total, topping) => total + (topping.total_price * product.quantity), 0
               );

               // Set the total price as the sum of the base product and its toppings
               product.total_price = baseProductPrice + totalToppingsPrice;
            }

        } else {
            // Product not found, create a new one
            const newProduct: MakeTransactionProduct = {
                temp_id,
                id: selectedProduct.id,
                name: selectedProduct.name,
                quantity: newQuantity ?? 1,
                price: selectedProduct.price, // Default price to 0 if not provided
                total_price: (newQuantity ?? 1) * selectedProduct.price,
                topings: []
            };
            transaction.products.push(newProduct);
        }

        // Recalculate total_price for the transaction
        transaction.total_price = transaction.products.reduce((total, p) => total + p.total_price, 0);

        return transaction;
    });
}


// Function to update or add a topping and recalculate total prices
export function updateOrAddTopping(temp_id: string, selectedToping: Toping|MakeTransactionToping, addition: boolean = true, newQuantity?: number) {
    makeTransaction.update((transaction) => {
        const product = transaction.products.find(p => p.temp_id === temp_id);

        if (product) {
            const toppingIndex = product.topings.findIndex(t => t.id === selectedToping.id);
            
            if (toppingIndex !== -1) {
                // Topping found, update its quantity
                const topping = product.topings[toppingIndex];
                if(addition){
                    if(newQuantity){ topping.quantity = newQuantity }
                    else { topping.quantity++; }
                }else {
                    if(newQuantity != undefined){ topping.quantity = newQuantity }
                    else { topping.quantity--; }
                }

                // If quantity is less than 1, remove the topping
                if (topping.quantity < 1) {
                    product.topings.splice(toppingIndex, 1); // Remove topping from product
                } else {
                    // Update topping total_price if not removed
                    topping.total_price = topping.quantity * topping.price;
                }

            } else {
                // Topping not found, create a new one
                const newTopping: MakeTransactionToping = {
                    id: selectedToping.id,
                    name: selectedToping.name,
                    quantity: newQuantity ?? 1,
                    price: selectedToping.price,
                    total_price: (newQuantity ?? 1) * selectedToping.price
                };
                product.topings.push(newTopping);
            }

            // Recalculate total_price for the product after topping update
            const baseProductPrice = product.quantity * product.price;
            const totalToppingsPrice = product.topings.reduce(
                (total, topping) => total + topping.total_price, 0
            );
            product.total_price = baseProductPrice + totalToppingsPrice;

            // Recalculate total_price for the transaction
            transaction.total_price = transaction.products.reduce((total, product) => total + product.total_price, 0);
        }

        return transaction;
    });
}

// Function to recalculate total prices based on the current state of the store
export function recalculateTotalPrice(transaction: MakeTransaction) {
    transaction.products.forEach(product => {
        // Recalculate the total price for each product based on its quantity and topings
        product.total_price = product.quantity * product.price + product.topings.reduce((total, t) => total + t.total_price, 0);
    });

    // Recalculate the total price for the entire transaction
    transaction.total_price = transaction.products.reduce((total, p) => total + p.total_price, 0);
}



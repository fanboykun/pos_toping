<script lang="ts">
	import { capitalizeFirstLetterOfEachWord, formatCurrency, generateSecureRandomId } from '$lib';
	import { makeTransaction, updateOrAddProduct, updateOrAddTopping, type MakeTransactionProduct, type MakeTransactionToping } from '$lib/transaction.js';
    import * as Dialog from "$lib/components/ui/dialog"
	import type { Product, Toping } from '@prisma/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ProductCategoryList from './(components)/ProductCategoryList.svelte';
	import ProductList from './(components)/ProductList.svelte';

    export let data
    console.log(data)
    
    let isDialogOpen = false
    let currenSelectedProductTempId: string|undefined

    onMount(() => {
        $makeTransaction.userId = data.user?.id
    })

    const addProduct = (product: Product|MakeTransactionProduct, temp_id?: string, addition: boolean = true) => {
        if(!temp_id) {
            temp_id = generateSecureRandomId()
            updateOrAddProduct(temp_id, product)
            isDialogOpen = true
        }else {
            updateOrAddProduct(temp_id, product, addition)
        }
        currenSelectedProductTempId = temp_id
    }

    const removeProduct = (product: MakeTransactionProduct, temp_id: string|undefined) => {
        if(!temp_id) return
        updateOrAddProduct(temp_id, product, false, 0)
    }

    const addToping = (toping: Toping|MakeTransactionToping, addition: boolean = true ) => {
        if(!currenSelectedProductTempId) return
       updateOrAddTopping(currenSelectedProductTempId, toping, addition)
    }

    const removeToping = (toping: MakeTransactionToping) => {
        if(!currenSelectedProductTempId) return
       updateOrAddTopping(currenSelectedProductTempId, toping, false, 0)
    }

    let processing = false
    const handleAddTransaction: SubmitFunction = ( { formData, cancel } ) => {
        processing = true
        formData.append('data', JSON.stringify($makeTransaction))
        return async ( { result } ) => {
            if(result.type == "success") {
                processing = true
                applyAction(result)
                resetMakeTransaction()
                return goto('/order')
            }
        }
    }

    const resetMakeTransaction = () => {
        $makeTransaction.userId = ''
        $makeTransaction.total_price = 0
        $makeTransaction.products = []
        currenSelectedProductTempId = undefined
    }

    $: categories = data.productsGroupedByCategory
    $: filteredProducts = [] as Product[]
    onMount(() => {
        filterProducts()
    })
    const filterCategory = (selectedCategoryId: string|undefined = undefined) => {
        if (!selectedCategoryId) {
            // Return all products if no category is selected
            return categories.flatMap(category => category.products);
        }

        // Return products for the selected category
        const category = categories.find(category => category.categoryId === selectedCategoryId);
        return category ? category.products : [];
    }

    const filterProducts = (selectedCategoryId: string|undefined = undefined) => {
        return filteredProducts = filterCategory(selectedCategoryId)
    }

</script>
<div class="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full p-4 h-auto min-h-[80svh] max-h-[90svh]">

    <div class="col-span-6 sm:hidden flex gap-x-2 w-full h-fit px-4 py-0.5 shadow-sm rounded-xl items-center justify-center">
        <Button type="button" variant="outline" class="flex gap-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-indigo-600">
                <path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clip-rule="evenodd" />
            </svg>              
            Produk
        </Button>
        <Button type="button" variant="outline" class="flex gap-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-indigo-600">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>              
            Keranjang
        </Button>
    </div>

    <div class="col-span-6 sm:col-span-4 w-full h-full flex flex-col gap-4 p-2 border shadow-lg rounded-xl">
        {#if categories}
        <ProductCategoryList categories={categories} onCategorySelected={filterProducts} />
        <div class="h-full w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 gap-4 max-h-[65svh] sm:max-h-[75svh] overflow-auto">
            <!-- {#each data.productsGroupedByCategory as productGrouped} -->
            {#each filteredProducts as product}
            {@const isSelected = $makeTransaction.products.find(item => item.id === product.id) != undefined}
            <ProductList {product} {isSelected}>
                <button on:click={() => addProduct(product)} type="button" class="shadow-md hover:shadow-lg inline-flex items-center gap-x-1 text-sm font-semibold rounded-xl border bg-indigo-100 px-3 py-1 border-transparent text-indigo-800 decoration-2 hover:text-indigo-900 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 shrink-0 text-indigo-600">
                        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                    </svg>          
                    Tambah
                  </button>
            </ProductList>
            {/each}
            <!-- {/each} -->
        </div>
        {/if}
    </div>
    
    <div class="col-span-2 w-full h-full hidden sm:flex flex-wrap gap-4 flex-col justify-between p-2 border shadow-lg rounded-xl">

        <div class=" flex flex-col gap-y-4">
            <div class="p-2 border rounded-xl shadow-md flex flex-col gap-y-2">
                <div class="flex items-center justify-between px-2">
                    <div class="flex gap-x-1 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-indigo-600">
                            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                        </svg>                      
                        <span class="text-gray-700 font-medium">Cashier</span>
                    </div>
                    <span class="font-medium text-gray-700">{data.user?.name ?? 'Unknown'}</span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex gap-x-1 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-green-600">
                            <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                            <path fill-rule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
                        </svg>                                           
                        <span class="text-gray-700 font-medium">Total Price</span>
                    </div>
                    <span class="font-medium text-gray-700">{formatCurrency($makeTransaction.total_price)}</span>
                </div>
            </div>

            <div class="max-h-[60svh] overflow-auto flex flex-col gap-2">
                {#each $makeTransaction.products as $product}
                    <div class="border p-2 rounded-xl shadow-md flex flex-col gap-y-2">
        
                        <!-- Input Number -->
                        <div class="py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700" data-hs-input-number="">
                            <div class="w-full flex justify-between items-center gap-x-3">
                            <div>
                                <span class="flex gap-x-1 items-center font-medium text-sm text-gray-800 dark:text-white">
                                {capitalizeFirstLetterOfEachWord($product.name ?? '')}
                                </span>
                                <span class="block text-xs text-gray-500 dark:text-neutral-400">
                                {formatCurrency($product.total_price)}
                                </span>
                            </div>
                            <div class="flex items-center gap-x-1.5">
                                <button type="button" on:click={() => addProduct($product, currenSelectedProductTempId, false)} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease" data-hs-input-number-decrement="">
                                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                    </svg>
                                </button>
                                <input type="number" value={$product.quantity} class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" aria-roledescription="Number field" data-hs-input-number-input="">
                                <button type="button" on:click={() => addProduct($product, currenSelectedProductTempId, true)} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase" data-hs-input-number-increment="">
                                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                    </svg>
                                </button>
                            </div>
                            </div>
                        </div>
                        <!-- End Input Number -->
        
                        {#each $product.topings as toping}
                        <div class="px-4 py-1 flex flex-col gap-2 w-full">
                            <div class="flex gap-x-1 w-full items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>                              
                                <!-- Input Number -->
                                <div class="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700" data-hs-input-number="">
                                    <div class="w-full flex justify-between items-center gap-x-3">
                                    <div>
                                        <span class="flex gap-x-1 items-center font-medium text-sm text-gray-800 dark:text-white">
                                        {capitalizeFirstLetterOfEachWord(toping.name ?? '')}
                                        </span>
                                        <span class="block text-xs text-gray-500 dark:text-neutral-400">
                                        {formatCurrency(toping.total_price)}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-x-1.5">
                                        <button type="button" on:click={() => addToping(toping, false)} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease" data-hs-input-number-decrement="">
                                            <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M5 12h14"></path>
                                            </svg>
                                        </button>
                                        <input type="number" value={toping.quantity} class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" aria-roledescription="Number field" data-hs-input-number-input="">
                                        <button type="button" on:click={() => addToping(toping)} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase" data-hs-input-number-increment="">
                                            <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="M12 5v14"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                <!-- End Input Number -->
                            </div>
                        </div>
                        {/each}
                        <button type="button" class="flex gap-x-1 items-center justify-center px-2 py-1.5 text-sm font-medium bg-indigo-500 rounded-xl border w-full shadow-md text-white" on:click={() => { currenSelectedProductTempId = $product.temp_id; isDialogOpen = true }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-white">
                                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                            </svg>          
                            <span>Topping</span>
                        </button>
        
                        <div class="flex justify-between items-center w-full">
                            <span class="pt-2 w-full h-full text-sm font-medium text-gray-700 ">Total: {formatCurrency($product.total_price)}</span>
                            <button type="button" on:click={() => removeProduct($product, currenSelectedProductTempId)} class="px-2 py-2 rounded-xl bg-red-500 text-white w-fit">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-white">
                                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                </svg>                          
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        {#if $makeTransaction.products.length != 0}
        <div class="w-full h-fit items-end justify-end">
            <form action="?/addTransaction" use:enhance={handleAddTransaction} method="post">
                <Button class="w-full flex gap-x-1" type="submit" disabled={processing}>
                    Simpan
                    {#if processing}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>  
                      {/if}
                </Button>
            </form>
        </div>
        {/if}
    </div>

</div>

<Dialog.Root bind:open={isDialogOpen} onOpenChange={() => isDialogOpen = !isDialogOpen}>
    <Dialog.Content class="sm:max-w-[425px] max-h-[90svh] overflow-auto">
      <Dialog.Header>
        <Dialog.Title>Add Toping to the Product</Dialog.Title>
        <Dialog.Description>
            Select Topping
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4 max-h-[50svh] overflow-y-auto">
        <div class="flex flex-col gap-2">
            {#if data.topings}
            {#each data.topings as toping}
            {@const hasSelected = $makeTransaction.products.find(item => item.temp_id === currenSelectedProductTempId)?.topings.find(item => item.id === toping.id)}
            {@const quantity = $makeTransaction.products.find(item => item.temp_id === currenSelectedProductTempId)?.topings.find(item => item.id === toping.id)?.quantity}
            <!-- Input Number -->
                <div class="py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700" data-hs-input-number="">
                    <div class="w-full flex justify-between items-center gap-x-3">
                    <div>
                        <span class="flex gap-x-1 items-center font-medium text-sm text-gray-800 dark:text-white">
                        {capitalizeFirstLetterOfEachWord(toping.name ?? '')}
                        {#if hasSelected}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-indigo-600">
                            <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                        </svg>                                
                        {/if}                
                        </span>
                        <span class="block text-xs text-gray-500 dark:text-neutral-400">
                        {formatCurrency(toping.price)}
                        </span>
                    </div>
                    <div class="flex items-center gap-x-1.5">
                        <button type="button" on:click={() => addToping(toping, false)} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease" data-hs-input-number-decrement="">
                            <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"></path>
                            </svg>
                        </button>
                        <input type="number" value={ quantity ?? 0 } class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" aria-roledescription="Number field" data-hs-input-number-input="">
                        <button type="button" on:click={() => addToping(toping)} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase" data-hs-input-number-increment="">
                            <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                        </button>
                    </div>
                    </div>
                </div>
            <!-- End Input Number -->
            {/each}
            {/if}
        </div>
      </div>
      <Dialog.Footer>
        <Button type="button" on:click={() => isDialogOpen = false}>Done</Button>
      </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
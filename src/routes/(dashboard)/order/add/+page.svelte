<script lang="ts">
	import { capitalizeFirstLetterOfEachWord, formatCurrency, generateSecureRandomId } from '$lib';
	import { makeTransaction, updateOrAddProduct, updateOrAddTopping, type MakeTransactionProduct, type MakeTransactionToping } from '$lib/transaction.js';
    import * as Dialog from "$lib/components/ui/dialog"
	import type { Product, Toping } from '@prisma/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { beforeNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ProductCategoryList from './(components)/ProductCategoryList.svelte';
	import ProductList from './(components)/ProductList.svelte';
	import OrderMenu from './(components)/OrderMenu.svelte';
	import { horizontalSlide } from '$lib/client/transition';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import type { ProductsGroupedByCategory } from '$lib/server/product';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import { toast } from 'svelte-sonner';

    export let data
    export let form

    let isDialogOpen = false
    let currentSelectedProductTempId: string|undefined

    $: filteredProducts = [] as Product[]

    $: {
      if(form?.success != undefined) {
          let isSuccess = form.success as boolean
          let toastMessage = isSuccess ? 'The Action Executed Successfully' : 'The Action Failed to Execute'
          if(form.message && typeof form.message === 'string') toastMessage = form.message
          toast(isSuccess ? 'Success' : 'Failed', {
              description: toastMessage,
          })
      }
    }
    
    onMount(async () => {
        $makeTransaction.userId = data.user?.id
        const productsGroupedByCategory = await data.productsGroupedByCategory
        filteredProducts = filterCategory(undefined, productsGroupedByCategory)
    })
    
    beforeNavigate(() => {
        resetMakeTransaction()
    })

    const addProduct = (product: Product|MakeTransactionProduct, temp_id?: string, addition: boolean = true) => {
        if(!temp_id) {
            temp_id = generateSecureRandomId()
            updateOrAddProduct(temp_id, product)
            isDialogOpen = true
        }else {
            updateOrAddProduct(temp_id, product, addition)
        }
        currentSelectedProductTempId = temp_id
    }

    const removeProduct = (product: MakeTransactionProduct, temp_id: string|undefined) => {
        if(!temp_id) return
        updateOrAddProduct(temp_id, product, false, 0)
    }

    const addToping = (toping: Toping|MakeTransactionToping, addition: boolean = true ) => {
        if(!currentSelectedProductTempId) return
        updateOrAddTopping(currentSelectedProductTempId, toping, addition)
    }

    const removeToping = (toping: MakeTransactionToping) => {
        if(!currentSelectedProductTempId) return
       updateOrAddTopping(currentSelectedProductTempId, toping, false, 0)
    }

    let processing = false  // form submitting state
    const handleAddTransaction: SubmitFunction = ( { formData, cancel } ) => {
        processing = true
        formData.append('data', JSON.stringify($makeTransaction))
        return async ( { result, update } ) => {
            processing = false
            if(result.type == "success") {
                resetMakeTransaction()
                await update()
                return goto('/order')
            }
        }
    }

    const resetMakeTransaction = () => {
        $makeTransaction.userId = ''
        $makeTransaction.total_price = 0
        $makeTransaction.products = []
        currentSelectedProductTempId = undefined
    }

    const filterCategory = (selectedCategoryId: string|undefined = undefined, productsGroupedByCategory: ProductsGroupedByCategory) => {
        if (!selectedCategoryId) {
            // Return all products if no category is selected
            return productsGroupedByCategory.flatMap(category => category.products);
        }

        // Return products for the selected category
        const category = productsGroupedByCategory.find(category => category.categoryId === selectedCategoryId);
        return category ? category.products : [];
    }

    let transitionProps = { duration: 500, axis: 'x' }  // change menu transition props
    let selectedMenu: 'product'|'cart' = 'product'  // change menu on mobile
    const changeMenu = (menu: 'product'|'cart' = 'product') => {
        selectedMenu = menu
    }


</script>
{#await data.productsGroupedByCategory}
    <LoadingState />
{:then productsGroupedByCategory} 
<div class="grid grid-cols-4 md:grid-cols-12 gap-2 w-full p-4 h-auto min-h-[80svh] max-h-[90svh] place-content-start">

    <OrderMenu onMenuChanged={changeMenu} />
    {#key selectedMenu}
    <div in:horizontalSlide={{ ...transitionProps }} class="col-span-4 md:col-span-7 xl:col-span-8 w-full h-full min-h-max gap-4 p-2 border shadow-lg rounded-xl {selectedMenu == 'product' ? 'flex flex-col' : 'hidden'}">
        {#if productsGroupedByCategory}
        <ProductCategoryList categories={productsGroupedByCategory} onCategorySelected={(cId) => { filteredProducts = filterCategory(cId, productsGroupedByCategory) }} />
        <div class="h-full w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 gap-4 max-h-[65svh] sm:max-h-[75svh] overflow-auto justify-self-start">
            <!-- {filteredProducts = filterProducts(undefined, productsGroupedByCategory)} -->
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
        </div>
        {/if}
    </div>
    
    <div in:horizontalSlide={{ ...transitionProps }} class="col-span-4 md:col-span-5 xl:col-span-4 w-full h-full gap-4 justify-between p-2 border shadow-lg rounded-xl {selectedMenu == 'cart' ? 'flex flex-col' : 'hidden md:flex flex-col'}">

        <div class=" flex flex-col gap-y-4">
            <div class="p-2 border rounded-xl shadow-md flex flex-col gap-y-2">
                <div class="flex items-center justify-between px-2">
                    <div class="flex gap-x-1 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-indigo-600">
                            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                        </svg>                      
                        <span class="text-gray-700 font-medium">Kasir</span>
                    </div>
                    <span class="font-medium text-gray-700">{data.user?.name ?? 'Unknown'}</span>
                </div>
                <div class="flex items-center justify-between px-2">
                    <div class="flex gap-x-1 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-green-600">
                            <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                            <path fill-rule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clip-rule="evenodd" />
                        </svg>                                           
                        <span class="text-gray-700 font-medium">Total Harga</span>
                    </div>
                    <span class="font-medium text-gray-700">{formatCurrency($makeTransaction.total_price)}</span>
                </div>
            </div>

            <div class="max-h-[60svh] overflow-auto flex flex-col gap-2">
                {#each $makeTransaction.products as $product}
                    <div class="border p-2 rounded-xl shadow-md flex flex-col gap-y-2">
        
                        <!-- Input Number -->
                        <div class="py-2 px-2 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700" data-hs-input-number="">
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
                                <button type="button" on:click={() => { currentSelectedProductTempId = $product.temp_id; addProduct($product, currentSelectedProductTempId, false) }} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease" data-hs-input-number-decrement="">
                                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                    </svg>
                                </button>
                                <input type="number" disabled={true} value={$product.quantity} class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" aria-roledescription="Number field" data-hs-input-number-input="">
                                <button type="button" on:click={() => { currentSelectedProductTempId = $product.temp_id; addProduct($product, currentSelectedProductTempId, true)}} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase" data-hs-input-number-increment="">
                                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5v14"></path>
                                    </svg>
                                </button>
                            </div>
                            </div>
                        </div>
                        <!-- End Input Number -->
        
                        {#each $product.topings as $toping}
                        <div class="px-0 py-1 flex flex-col gap-2 w-full">
                            <div class="flex gap-x-1 w-full items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>                              
                                <!-- Input Number -->
                                <div class="w-full py-2 px-1 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700" data-hs-input-number="">
                                    <div class="w-full flex justify-between items-center gap-x-3">
                                    <div>
                                        <span class="flex gap-x-1 items-center font-medium text-sm text-gray-800 dark:text-white">
                                        {capitalizeFirstLetterOfEachWord($toping.name ?? '')}
                                        </span>
                                        <span class="block text-xs text-gray-500 dark:text-neutral-400">
                                        {formatCurrency($toping.total_price)}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-x-1.5">
                                        <button type="button" on:click={() => { currentSelectedProductTempId = $product.temp_id; addToping($toping, false) }} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease" data-hs-input-number-decrement="">
                                            <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M5 12h14"></path>
                                            </svg>
                                        </button>
                                        <input type="number" disabled={true} value={$toping.quantity} class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" aria-roledescription="Number field" data-hs-input-number-input="">
                                        <button type="button" on:click={() => {currentSelectedProductTempId = $product.temp_id; addToping($toping) }} class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase" data-hs-input-number-increment="">
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
                        <button type="button" class="flex gap-x-1 items-center justify-center px-2 py-1.5 text-sm font-medium bg-indigo-500 rounded-xl border w-full shadow-md text-white" on:click={() => { currentSelectedProductTempId = $product.temp_id; isDialogOpen = true }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-white">
                                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
                            </svg>          
                            <span>Topping</span>
                        </button>
        
                        <div class="flex justify-between items-center w-full">
                            <span class="pt-2 w-full h-full text-sm font-medium text-gray-700 ">Total: {formatCurrency($product.total_price)}</span>
                            <button type="button" on:click={() => {  removeProduct($product, $product.temp_id) }} class="px-2 py-2 rounded-xl bg-red-500 text-white w-fit">
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
    {/key}

</div>
{:catch}
    <ErrorState />
{/await}

{#await data.topings}
<span class="sr-only">loading toppings data</span>    
{:then topings} 
<Dialog.Root bind:open={isDialogOpen} onOpenChange={() => isDialogOpen = !isDialogOpen}>
    <Dialog.Content class="sm:max-w-[425px] max-h-[90svh] overflow-auto">
      <Dialog.Header>
        <Dialog.Title>Tambah Topping ke produk</Dialog.Title>
        <Dialog.Description>
            Pilih topping untuk di tambahkan
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4 max-h-[50svh] overflow-y-auto">
        <div class="flex flex-col gap-2">
            {#if topings}
            {#each topings as toping}
            {@const hasSelected = $makeTransaction.products.find(item => item.temp_id === currentSelectedProductTempId)?.topings.find(item => item.id === toping.id)}
            {@const quantity = $makeTransaction.products.find(item => item.temp_id === currentSelectedProductTempId)?.topings.find(item => item.id === toping.id)?.quantity}
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
                        <input type="number" disabled={true} value={ quantity ?? 0 } class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" aria-roledescription="Number field" data-hs-input-number-input="">
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
        <Button type="button" on:click={() => isDialogOpen = false}>Selesai</Button>
      </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
{/await}
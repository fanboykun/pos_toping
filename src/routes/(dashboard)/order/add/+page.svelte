<script lang="ts">
	import { generateSecureRandomId } from '$lib';
	import { makeTransaction, recalculateTotalPrice, updateOrAddProduct, updateOrAddTopping, type MakeTransactionProduct, type MakeTransactionToping } from '$lib/transaction.js';
    import * as Dialog from "$lib/components/ui/dialog"
	import type { Product, Toping } from '@prisma/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
    export let data
    
    let isDialogOpen = false
    let currenSelectedProductTempId: string|undefined

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

    const handleAddTransaction: SubmitFunction = ( { formData, submitter } ) => {
        submitter?.setAttribute('disabled', 'true')
        formData.append('data', JSON.stringify($makeTransaction))

        return async ( { result } ) => {
            submitter?.setAttribute('disabled', 'false')
            resetMakeTransaction()
            if(result.type == "error" || result.type == "failure" ) return
            return goto('/order')
        }
    }
    const resetMakeTransaction = () => {
        $makeTransaction.cashier_id = ''
        $makeTransaction.total_price = 0
        $makeTransaction.products = []
        currenSelectedProductTempId = undefined
    }

    $: console.log($makeTransaction)
</script>
<div class="w-full h-full flex flex-wrap gap-4 p-1">
{#each data.products as product}
<button type="button" on:click={() => addProduct(product)} class="p-2 border bg-neutral-50 flex flex-col">
    <span>
        {product.name}
    </span>
    <span>
        {product.price}
    </span>
</button>
{/each}
</div>

<div class="w-full h-full flex flex-wrap gap-4 p-1 flex-col">
    <div class="p-4 border flex flex-col">
        <span>cashier : {$makeTransaction.cashier_id}</span>
        <span> total price: {$makeTransaction.total_price}</span>
    </div>
{#each $makeTransaction.products as $product}
{@const hasToping = $product.topings.length > 0}
    <div class="border p-2 rounded-lg flex flex-col">
        <span>{$product.name}</span>
        <span>price: {$product.price}</span>
        <div>
            <span> quantity: </span> 
            <button type="button" on:click={() => addProduct($product, currenSelectedProductTempId, false)} class="px-2 border rounded-md">-</button>
            <span>{$product.quantity}</span>
            <button type="button" on:click={() => addProduct($product, currenSelectedProductTempId, true)} class="px-2 border rounded-md">+</button>
        </div>
        <span>total price: {$product.total_price}</span>
        <div class="ml-4 p-2 flex flex-col gap-4">
            {#each $product.topings as toping}
            <div class="flex flex-col border p-2 w-fit rounded-md">
                <span>{toping.name}</span>
                <span>price: {toping.price}</span>
                <div>
                    <span> quantity: </span> 
                    <button type="button" on:click={() => addToping(toping, false)} class="px-2 border rounded-md">-</button>
                    <span>{toping.quantity}</span>
                    <button type="button" on:click={() => addToping(toping)} class="px-2 border rounded-md">+</button>
                </div>
                <span>total price: {toping.total_price}</span>
                <button type="button" on:click={() => removeToping(toping)} class="px-2 rounded-md border w-full place-self-center">remove toping</button>
            </div>
            {/each}
            <button type="button" class="px-2 rounded-md border w-fit place-self-start" on:click={() => { currenSelectedProductTempId = $product.temp_id; isDialogOpen = true }}>add new topping</button>
        </div>
        <button type="button" on:click={() => removeProduct($product, currenSelectedProductTempId)} class="px-2 rounded-md border w-fit place-self-center">remove product</button>
    </div>
{/each}
{#if $makeTransaction.products.length != 0}
<div class="w-full">
    <form action="?/addTransaction" use:enhance={handleAddTransaction} method="post">
        <Button class="w-full" type="submit">Save</Button>
    </form>
</div>
{/if}
</div>

<Dialog.Root bind:open={isDialogOpen} onOpenChange={() => isDialogOpen = !isDialogOpen}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Add Toping</Dialog.Title>
        <Dialog.Description>
            Select toping
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="flex flex-col gap-2">
            {#each data.topings as toping}
            {@const hasSelected = $makeTransaction.products.find(item => item.temp_id === currenSelectedProductTempId)?.topings.find(item => item.id === toping.id)}
            {@const quantity = $makeTransaction.products.find(item => item.temp_id === currenSelectedProductTempId)?.topings.find(item => item.id === toping.id)?.quantity}
            <div class="flex w-full gap-2">
                <div class="p-2 w-full border { hasSelected != undefined ? 'border-indigo-500' : 'border-red-800'}">{toping.name}</div>
                <button type="button" class="border p-2" on:click={() => addToping(toping, false)}>-</button>
                <span class="text-center p-2 border">{quantity ?? 0}</span>
                <button type="button" class="border p-2" on:click={() => addToping(toping)}>+</button>
            </div>
            {/each}
        </div>
      </div>
      <Dialog.Footer>
        <Button type="button" on:click={() => isDialogOpen = false}>Done</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
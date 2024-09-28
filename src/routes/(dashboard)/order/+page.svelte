<script lang="ts">
	import { capitalizeFirstLetterOfEachWord, createGradientAvatar, formatCurrency, formatDay, formatTime, getFistCharFromName } from "$lib";
	import { logicalPropertiesHorizontalSlide } from "$lib/client/transition.js";
	import type { TrasactionWithProductWithToping } from "$lib/server/transaction";
	import { fly } from "svelte/transition";
  import * as Avatar from "$lib/components/ui/avatar";
	import ProductOrderList from "./(components)/ProductOrderList.svelte";
	import ToppingOrderList from "./(components)/ToppingOrderList.svelte";
	import DeleteOrder from "./(components)/DeleteOrder.svelte";
	import ErrorState from "$lib/components/ui/ErrorState.svelte";
	import TableEmptyState from "$lib/components/ui/TableEmptyState.svelte";
	import LoadingState from "$lib/components/ui/LoadingState.svelte";
	import TablePagination from "$lib/components/ui/TablePagination.svelte";

  export let data
  export let form

  // const transactions: TrasactionWithProductWithToping = data.transactions
  let openedItem: string|undefined

  const showHideItem = (transactionId: string) => {
      if(!openedItem) return openedItem = transactionId
      if(openedItem == transactionId) return openedItem = undefined
      openedItem = transactionId
  }

  let isDeleteTransactionModalOpen = false
  let isAddTransactionModalOpen = false
  let isEditTransactionModalOpen = false

  let selectedTransactionId: string

  const onActionModalCLose = (modal: 'add'|'delete'|'edit') => {
  switch (modal) {
    case 'add' :
      isAddTransactionModalOpen = false;
      break
    case 'delete' :
      isDeleteTransactionModalOpen = false;
      break
    case 'edit' :
      isEditTransactionModalOpen = false;
      break
  }

}

</script>

{#await data.transactions}
  <LoadingState />
{:then transactions} 
<!-- Table Section -->
<div class="max-w-[85rem] px-4 pt-4 sm:px-6 lg:px-8 xl:pb-4 pb-[100px] mx-auto">
    <!-- Card -->
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
            <!-- Header -->
            <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
              <div>
                <h2 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Order List
                </h2>
                <p class="text-sm text-gray-600 dark:text-neutral-400">
                  Semua
                  <span class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium" >
                    Transaksi
                  </span>
                  yang telah dibuat ditampilkan dibawah 
                </p>
              </div>
  
              <div>
                <div class="inline-flex gap-x-2">
  
                  <a href="order/add" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Create
                  </a>
                </div>
              </div>
            </div>
            <!-- End Header -->
  
            <!-- Table -->
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead class="bg-gray-50 dark:bg-neutral-900">
                <tr>
  
                    <th scope="col" class="px-6 py-3 text-start">
                        <div class="flex items-center gap-x-2">
                            <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Show Item
                            </span>
                        </div>
                    </th>
  
                    <th scope="col" class="px-6 py-3 text-start">
                        <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Created by
                        </span>
                        </div>
                    </th>

                    <th scope="col" class="px-6 py-3 text-start">
                        <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Total
                        </span>
                        </div>
                    </th>
    
                    <th scope="col" class="px-6 py-3 text-start">
                        <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Status
                        </span>
                        </div>
                    </th>
    
                    <th scope="col" class="px-6 py-3 text-start">
                        <div class="flex items-center gap-x-2">
                        <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Created
                        </span>
                        </div>
                    </th>
    
                    <th scope="col" class="px-6 py-3 text-end"></th>
                </tr>
              </thead>
  
              <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">

                {#if transactions}
                {#each transactions as transaction}
                <tr>

                    <td class="size-px whitespace-nowrap">
                        <div class="px-6 py-3">
                          <button type="button" on:click={() => showHideItem(transaction.id)} class="py-2 px-3 inline-flex items-center gap-x-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                            Show Item
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4 text-gray-400 dark:text-neutral-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>                          
                          </button>
                        </div>
                      </td>
  
                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <div class="flex items-center gap-x-2">
                        <Avatar.Root class="h-6 w-6 sm:h-8 sm:w-8">
                          <Avatar.Image src={createGradientAvatar()} alt="user avatar" />
                          <Avatar.Fallback>{getFistCharFromName(transaction.user?.name)}</Avatar.Fallback>
                        </Avatar.Root>
                        <div class="grow">
                          <span class="text-sm text-gray-600 dark:text-neutral-400">{transaction?.user?.name ?? 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="text-sm font-medium text-gray-600 dark:text-neutral-400">{formatCurrency(transaction.total_price)}</span>
                    </div>
                  </td>

                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                        <svg class="size-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        Successful
                      </span>
                    </div>
                  </td>
                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-3 flex flex-col">
                      <span class="text-sm text-gray-600 dark:text-neutral-400">{formatDay(transaction.createdAt)}</span>
                      <span class="text-xs text-gray-600 dark:text-neutral-400">{formatTime(transaction.createdAt)}</span>
                    </div>
                  </td>
                  <td class="size-px whitespace-nowrap">
                    <div class="flex gap-x-2 px-2">
                      <button type="button" on:click={() => { selectedTransactionId = transaction.id; isDeleteTransactionModalOpen = true }} class="p-2 inline-flex items-center gap-x-0 text-sm font-semibold rounded-lg border border-red-400 text-red-600 decoration-2 hover:text-red-100 hover:bg-red-600 focus:shadow-md disabled:opacity-50 disabled:pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>                      
                      </button>
                      <a href="order/{transaction.id}" class="p-2 inline-flex items-center gap-x-0 text-sm font-semibold rounded-lg border border-blue-400 text-blue-600 decoration-2 hover:text-blue-100 hover:bg-blue-600 focus:shadow-md disabled:opacity-50 disabled:pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>                      
                      </a>
                    </div>
                  </td>
                </tr>
                {#if openedItem == transaction.id}
                    <tr in:fly={{ duration: 800 }}>
                        <td colspan="6">
                          <div in:logicalPropertiesHorizontalSlide={{direction: 'inline', duration: 800}} class="grid whitespace-nowrap md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2 gap-2 w-full min-h-[200px] bg-gray-200">
                            {#each transaction.productTransaction as productTransaction}
                              <ProductOrderList>
                                <span slot="name">{productTransaction.product.name}</span>
                                <span slot="product_price">{formatCurrency(productTransaction.product.price)}</span>
                                <span slot="product_quantity">@{productTransaction.quantity}</span>
                                <span slot="product_total_price">{formatCurrency(productTransaction.product.price * productTransaction.quantity)}</span>
                                <div slot="topping" class="flex flex-col gap-2">
                                  {#each productTransaction.productTopingTransaction as productTopingTransaction}
                                    <ToppingOrderList>
                                      <span slot="topping_name">{capitalizeFirstLetterOfEachWord(productTopingTransaction.toping.name)}</span>
                                      <span slot="topping_price">{formatCurrency(productTopingTransaction.toping.price)}</span>
                                      <span slot="topping_quantity">{productTopingTransaction.quantity}</span>
                                      <span slot="topping_total_price">{formatCurrency(productTopingTransaction.total)}</span>
                                    </ToppingOrderList>
                                  {/each}
                                </div>
                                <span slot="total_price">{formatCurrency(productTransaction.total)}</span>
                              </ProductOrderList>
                            {/each}
                          </div> 
                        </td>
                    </tr>
                {/if}
                {/each}
                {:else}
                <TableEmptyState />
                {/if}

              </tbody>
            </table>
            <!-- End Table -->
  
            <!-- Footer -->
            <TablePagination pagination={data.pagination} />
            <!-- End Footer -->
          </div>
        </div>
      </div>
    </div>
    <!-- End Card -->
</div>
  <!-- End Table Section -->

<DeleteOrder isOpen={isDeleteTransactionModalOpen} transactionId={selectedTransactionId} {form} onClose={() => onActionModalCLose('delete')} />
{:catch}
  <ErrorState />
{/await}




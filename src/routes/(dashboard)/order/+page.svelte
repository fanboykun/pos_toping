<script lang="ts">
	import { capitalizeFirstLetterOfEachWord, formatCurrency, formatDay, formatTime } from "$lib";
	import { horizontalSlide, logicalPropertiesHorizontalSlide } from "$lib/client/transition.js";
	import type { TrasactionWithProductWithToping } from "$lib/server/transaction";
	import { cubicInOut } from "svelte/easing";
	import { fly, slide } from "svelte/transition";

    export let data
    const transactions: TrasactionWithProductWithToping = data.transactions
    let openedItem: string|undefined

    const showHideItem = (transactionId: string) => {
        if(!openedItem) return openedItem = transactionId
        if(openedItem == transactionId) return openedItem = undefined
        openedItem = transactionId
    }
</script>


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
                        <img class="inline-block size-6 rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Avatar">
                        <div class="grow">
                          <span class="text-sm text-gray-600 dark:text-neutral-400">Christina Bersh</span>
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
                    <div class="px-6 py-1.5">
                      <div class="border border-indigo-500 rounded-lg inline-block">
                        <button id="hs-table-dropdown-1" type="button" class="hs-dropdown-toggle py-1.5 px-2 inline-flex justify-center items-center gap-2 rounded-lg text-gray-700 align-middle disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                {#if openedItem == transaction.id}
                    <tr in:fly={{ duration: 800 }}>
                        <td colspan="6">
                            <div in:logicalPropertiesHorizontalSlide={{direction: 'inline', duration: 800}} class="grid whitespace-nowrap md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2 gap-2 w-full min-h-[200px] bg-gray-200">
                                {#each transaction.productTransaction as productTransaction}
                                <div class="flex flex-col gap-2 bg-neutral-50 border p-2 rounded-md">
                                    <p class="flex justify-start items-center gap-1"> <span>{productTransaction.quantity}</span> <span class="font-semibold"> {productTransaction.product.name} </span> <span class="text-xs">({formatCurrency(productTransaction.product.price)})</span>  </p>
                                    {#if productTransaction.productTopingTransaction}
                                        <div class="px-4 py-2 bg-neutral-100 flex flex-col text-sm rounded-lg h-full">
                                            {#each productTransaction.productTopingTransaction as productTopingTransaction}
                                                <p class="flex gap-2 items-center justify-even text-sm font-medium">{capitalizeFirstLetterOfEachWord(productTopingTransaction.toping.name)} <span class="text-xs leading-tight font-normal">x{productTopingTransaction.quantity}</span> <span class="text-xs font-normal">{formatCurrency(productTopingTransaction.total)}</span>  </p>
                                            {/each}
                                        </div>
                                        {/if}
                                    <p class="text-sm">Total: <span class="font-medium">{formatCurrency(productTransaction.total)}</span></p>
                                </div>
                                {/each}
                            </div>
                        </td>
                    </tr>
                {/if}
                {/each}

              </tbody>
            </table>
            <!-- End Table -->
  
            <!-- Footer -->
            <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
              <div>
                <p class="text-sm text-gray-600 dark:text-neutral-400">
                  <span class="font-semibold text-gray-800 dark:text-neutral-200">6</span> results
                </p>
              </div>
  
              <div>
                <div class="inline-flex gap-x-2">
                  <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Prev
                  </button>
  
                  <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                    Next
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <!-- End Footer -->
          </div>
        </div>
      </div>
    </div>
    <!-- End Card -->
  </div>
  <!-- End Table Section -->
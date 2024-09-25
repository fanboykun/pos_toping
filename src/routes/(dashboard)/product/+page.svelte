<script lang="ts">
	import { capitalizeFirstLetterOfEachWord, formatCurrency, formatDay, formatTime } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ProductCard from '$lib/components/ui/ProductCard.svelte';
	import TableEmptyState from '$lib/components/ui/TableEmptyState.svelte';
	import type { ProductWithCategory } from '$lib/server/product';
	import CreateProduct from './(components)/CreateProduct.svelte';
	import DeleteProduct from './(components)/DeleteProduct.svelte';
	import EditProduct from './(components)/EditProduct.svelte';

  export let data
  export let form
  
  let isAddProductModalOpen = false
  let isDeleteProductModalOpen = false
  let isEditProductModalOpen = false

  let selectedProduct: Exclude<ProductWithCategory, null>

  const onActionModalCLose = (modal: 'add'|'delete'|'edit') => {
    switch (modal) {
      case 'add' :
        isAddProductModalOpen = false;
        break
      case 'delete' :
        isDeleteProductModalOpen = false;
        break
      case 'edit' :
        isEditProductModalOpen = false;
        break
    }
  }


</script>

{#await data.products}
  <LoadingState />
{:then products} 
<!-- Table Section -->
<div class="max-w-[85rem] px-4 py-4 sm:px-6 lg:px-8 mx-auto">
  <!-- Card -->
  <div class="flex flex-col">
    <div class="-m-1.5 overflow-x-auto">
      <div class="p-1.5 min-w-full inline-block align-middle">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
          <!-- Header -->
          <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Product List
              </h2>
              <p class="text-sm text-gray-600 dark:text-neutral-400">
                Semua produk yang telah dibuat ditampilkan dibawah
              </p>
            </div>

            <div>
              <div class="inline-flex gap-x-2">

                <button type="button" on:click={() => isAddProductModalOpen = true} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Create
                </button>
              </div>
            </div>
          </div>
          <!-- End Header -->

          {#if products}
          <!-- Table -->
           <div class="grid grid-cols-1 w-full sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-2">
             {#each products as product}
             <ProductCard>
               <span slot="name">{product.name}</span>
               <span slot="category">{capitalizeFirstLetterOfEachWord(product.category?.name ?? '')}</span>
               <span slot="price">{formatCurrency(product.price)}</span>
               <span slot="price_description">All Variant</span>
               <span slot="status">Ready</span>
               <div slot="action">
                  <Button class="py-2 px-3 " type="button" variant="destructive" on:click={() => { isDeleteProductModalOpen = true; selectedProduct = product }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>                      
                  </Button>
                  <Button type="button" on:click={() => { isEditProductModalOpen = true; selectedProduct = product }} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>                      
                  </Button>
               </div>
               <span slot="date">{formatDay(product.createdAt)}</span>
             </ProductCard>
             {/each}
           </div>
           <!-- End Table -->
            {:else}
            <TableEmptyState />
            {/if}
        

          <!-- Footer -->
          <!-- <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
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
          </div> -->
          <!-- End Footer -->
        </div>
      </div>
    </div>
  </div>
  <!-- End Card -->
</div>
<!-- End Table Section -->
{:catch}
<ErrorState />
{/await}


<DeleteProduct isOpen={isDeleteProductModalOpen} productId={selectedProduct?.id} {form} onClose={() => onActionModalCLose('delete')} />
  {#await data.categories }
    <div></div>
  {:then categories}
  {#if categories}
    <CreateProduct {form} isOpen={isAddProductModalOpen} categories={categories} onClose={() => onActionModalCLose('add')} />
    <EditProduct product={selectedProduct} {form} isOpen={isEditProductModalOpen} categories={categories} onClose={() => onActionModalCLose('edit')} />
  {/if}
  {/await}


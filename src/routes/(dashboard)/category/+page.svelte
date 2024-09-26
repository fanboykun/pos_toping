<script lang="ts">
	import { capitalizeFirstLetterOfEachWord } from '$lib';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import TableEmptyState from '$lib/components/ui/TableEmptyState.svelte';
	import type { Category } from '@prisma/client';
	import DeleteCategory from './(components)/DeleteCategory.svelte';
	import CreateCategory from './(components)/CreateCategory.svelte';
	import EditCategory from './(components)/EditCategory.svelte';

  export let data
  export let form

  let isDeleteCategoryModalOpen = false
  let isAddCategoryModalOpen = false
  let isEditCategoryModalOpen = false

  let selectedCategory: Category

const onActionModalCLose = (modal: 'add'|'delete'|'edit') => {
  switch (modal) {
    case 'add' :
      isAddCategoryModalOpen = false;
      break
    case 'delete' :
      isDeleteCategoryModalOpen = false;
      break
    case 'edit' :
      isEditCategoryModalOpen = false;
      break
  }
}

</script>

{#await data.categories}
<LoadingState />
{:then categories}
<!-- Table Section -->
<div class="max-w-[85rem] px-4 pt-4 sm:px-6 lg:px-8 xl:pb-4 pb-[100px] mx-auto">
    <!-- Card -->
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
            <!-- Header -->
            <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
              <div>
                <h2 class="text-xl font-semibold text-gray-800 ">
                  Kategori List
                </h2>
                <p class="text-sm text-gray-600">
                  Semua
                  <span class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium" >Kategori</span>
                  yang telah dibuat ditampilkan dibawah 
                </p>
              </div>
  
              <div>
                <div class="inline-flex gap-x-2">
                  {#if data.user?.isAdmin}
                  <button type="button" on:click={() => isAddCategoryModalOpen = true} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Create
                  </button>
                  {/if}
                </div>
              </div>
            </div>
            <!-- End Header -->
  
            <!-- List -->
            <div class="min-w-full grid grid-cols-2 max-[380px]:grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {#if categories}
              {#each categories as category}
              <div class="max-w-xs flex flex-col hover:shadow-lg hover:shadow-blue-200 bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl ">
                <div class="pt-4 px-4 pb-2">
                  <p class="text-gray-500  font-semibold">
                    {capitalizeFirstLetterOfEachWord(category.name)}
                  </p>
                  <p class="text-gray-500 text-sm">
                    3 Produk
                  </p>
                  {#if data.user?.isAdmin}
                  <div class="flex justify-end items-end gap-x-2">
                    <button type="button" on:click={() => { isDeleteCategoryModalOpen = true; selectedCategory = category }} class="p-2 mt-3 inline-flex items-center gap-x-0 text-sm font-semibold rounded-lg border border-red-400 text-red-600 decoration-2 hover:text-red-100 hover:bg-red-600 focus:shadow-md disabled:opacity-50 disabled:pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>                      
                    </button>
                    <button type="button" on:click={() => { isEditCategoryModalOpen = true; selectedCategory = category }} class="p-2 mt-3 inline-flex items-center gap-x-0 text-sm font-semibold rounded-lg border border-blue-400 text-blue-600 decoration-2 hover:text-blue-100 hover:bg-blue-600 focus:shadow-md disabled:opacity-50 disabled:pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>                      
                    </button>
                  </div>
                  {/if}
                </div>
              </div>
              {/each}
              {:else}
              <TableEmptyState />
              {/if}
            </div>
            <!-- End List -->
          </div>
        </div>
      </div>
    </div>
    <!-- End Card -->
</div>
<!-- End Table Section -->

<!-- Modal Section -->
<CreateCategory {form} isOpen={isAddCategoryModalOpen} onClose={() => onActionModalCLose('add')} />
<DeleteCategory isOpen={isDeleteCategoryModalOpen} categoryId={selectedCategory?.id} {form} onClose={() => onActionModalCLose('delete')} />
<EditCategory category={selectedCategory} {form} isOpen={isEditCategoryModalOpen} onClose={() => onActionModalCLose('edit')} />
 <!-- End Modal Section -->
{:catch}
<ErrorState />
{/await}


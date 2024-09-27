<script lang="ts">
	import { capitalizeFirstLetterOfEachWord } from "$lib";
	import type { ProductsGroupedByCategory } from "$lib/server/product";

    export let categories: ProductsGroupedByCategory
    export let onCategorySelected: Function
    let selectedCID: string|undefined = undefined
    const color = [
        {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
        },
        {
            bg: 'bg-gray-50',
            text: 'text-gray-500'
        },
        {
            bg: 'bg-teal-100',
            text: 'text-teal-800'
        },
        {
            bg: 'bg-blue-100',
            text: 'text-blue-800'
        },
        {
            bg: 'bg-red-100',
            text: 'text-red-800'
        },
        {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800'
        },
        {
            bg: 'bg-black/10',
            text: 'text-black'
        },
    ]
    const getColor = () => {
        const randomIndex = Math.floor(Math.random() * color.length);
        return color[randomIndex];
    }
    const setCategory = (cId: string|undefined = undefined) => {
        selectedCID = cId
        return onCategorySelected(cId)
    }
</script>
<div class="w-full flex flex-nowrap overflow-x-auto gap-x-2 py-2 h-fit">
    <button type="button" on:click={() => setCategory(undefined)} class="inline-flex h-full items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
        {#if selectedCID == undefined}
        <span class="size-1.5 inline-block rounded-full bg-blue-800 dark:bg-blue-500"></span>
        {/if}
        Semua
    </button>
    {#each categories as category}
    {@const color = getColor()}
    <button type="button" on:click={() => setCategory(category.categoryId)} class="inline-flex h-full items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium {color.bg} {color.text}">
        {#if selectedCID == category.categoryId && selectedCID != undefined}
        <span class="size-1.5  inline-block rounded-full bg-blue-800 dark:bg-blue-500"></span>
        {/if}
        {capitalizeFirstLetterOfEachWord(category.categoryName)}
    </button>
    {/each}
</div>

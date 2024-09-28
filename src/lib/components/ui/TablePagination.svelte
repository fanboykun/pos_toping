<script lang="ts">
	import { goto } from "$app/navigation";
	import type { PaginationType } from "$lib/pagination";

    export let pagination: PaginationType|undefined = undefined
</script>
{#if pagination}
<div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
    <div>
        <p class="text-sm text-gray-600 dark:text-neutral-400">
         menampilkan
         <span class="font-semibold text-gray-800 dark:text-neutral-200">{pagination.showing.from}</span>
         -
         <span class="font-semibold text-gray-800 dark:text-neutral-200">{pagination.showing.to}</span>
         dari
         <span class="font-semibold text-gray-800 dark:text-neutral-200">{pagination.showing.of}</span>
         hasil
        </p>
      </div>

    <div>
      <div class="inline-flex gap-x-2">
        <button type="button" on:click={() => goto(pagination.prevPageUrl)} disabled={!pagination.canGoPrev} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Prev
        </button>

        <button type="button" on:click={() => goto(pagination.nextPageUrl) } disabled={!pagination.canGoNext} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
          Next
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
</div>
{/if}

<script lang="ts">
    import * as Card from "$lib/components/ui/card";
	import type { TrasactionWithProductWithToping } from "$lib/server/transaction";

</script>

<Card.Root class="w-full p-2 bg-white shadow-lg shadow-indigo-50 hover:shadow-xl hover:shadow-indigo-100 transition-all group">
    <Card.Header class="p-2">
        <Card.Title class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-indigo-200 group-hover:text-indigo-400">
                <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
            </svg> 
            <span class="no-underline group-hover:underline group-hover:decoration-indigo-300">
                <slot name="name"></slot>
            </span>
        </Card.Title>
        <Card.Description>
            <div class="flex w-full justify-between px-2">
                <slot name="product_price"></slot>
                <slot name="product_quantity"></slot>
                <slot name="product_total_price"></slot>
            </div>
        </Card.Description>
    </Card.Header>
    
    <Card.Content class="grid gap-2 p-2 pt-0">
        <slot name="topping"></slot>

        <div class="flex flex-col gap-2 justify-center mt-2">
            {#if $$slots.total_price}
            <div class="ml-1 grid grid-cols-[25px_1fr] items-start">
                <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div class="space-y-1">
                    <p class="text-sm font-medium leading-none">
                        <slot name="total_price"></slot>
                    </p>
                </div>
            </div>
            {/if}
            {#if $$slots.date}
            <div class="flex gap-3 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-pink-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg>   
                <span class="text-xs text-gray-600 leading-tight">
                    <slot name="date"></slot>              
                </span> 
            </div>
            {/if}
        </div>

    </Card.Content>
    {#if $$slots.action}
    <Card.Footer>
        <div class="flex w-full gap-2 justify-center items-center">
            <slot name="action"></slot>
        </div>
    </Card.Footer>
    {/if}
</Card.Root>
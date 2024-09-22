<script lang="ts">
    import * as Card from "$lib/components/ui/card";
	import { capitalizeFirstLetter, capitalizeFirstLetterOfEachWord, formatCurrency } from "$lib";
	import { fly } from "svelte/transition";
    export let data

    let showItemState: 'menu'|'toping' = 'menu'
    const hideShowScrollBar = (state: 'in'|'out' = 'in') => {
		if(document) {
			switch (state) {
				case 'in': 
                    console.log('in')
					document.body.style.overflowX = 'hidden'
				break
				case 'out':
                    console.log('out')
					document.body.style.overflowX = 'visible'
				break
			}
		}
	}
</script>

<div class="p-4 flex flex-col gap-2 min-h-[100svh] w-full h-full bg-neutral-50">
    <div class="w-full flex items-center justify-center">
        <div class="flex">
            <div class="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-2 dark:bg-neutral-700 dark:hover:bg-neutral-600">
              <nav class="flex gap-x-2">
                <button on:click={() => showItemState = 'menu'} type="button" class="py-3 px-8 inline-flex items-center gap-2 text-sm font-medium rounded-lg focus:outline-none transition-all duration-500 {showItemState == 'menu' ? 'bg-white text-gray-700 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700 hover:hover:text-blue-600'}"  aria-current="page">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clip-rule="evenodd" />
                    </svg>                      
                  Menu
                </button>
                <button on:click={() => showItemState = 'toping'} type="button" class="py-3 px-8 inline-flex items-center gap-2 text-sm font-medium rounded-lg focus:outline-none transition-all duration-500 {showItemState == 'toping' ? 'bg-white text-gray-700 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700 hover:hover:text-blue-600'}" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
                    </svg>
                  Toping
                </button>
              </nav>
            </div>
          </div>
    </div>
    <div class="w-full h-full flex items-start justify-center">
        {#if data.products && data.topings}
            {#if showItemState == 'menu'}
            <div in:fly={{ x: 150, duration:500 }} on:introstart={() => hideShowScrollBar()} on:introend={() => hideShowScrollBar('out')} class="grid grid-cols-1 w-full sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {#each data.products as product}
                    <Card.Root class="w-full p-2 bg-white shadow-lg shadow-indigo-50 hover:shadow-xl hover:shadow-indigo-100 transition-all group">
                        <Card.Header class="p-2">
                            <Card.Title class="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-indigo-200 group-hover:text-indigo-400">
                                    <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
                                </svg> 
                                <span class="no-underline group-hover:underline group-hover:decoration-indigo-300">
                                    {product.name}
                                </span>
                            </Card.Title>
                            <Card.Description>{capitalizeFirstLetter(product.category?.name ?? '')}</Card.Description>
                        </Card.Header>
                        <Card.Content class="grid gap-2 p-2 pt-0">
                            <div class="flex items-center space-x-4 rounded-md border p-2 bg-neutral-50 shadow-md">
                            <!-- <Bell /> -->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-lime-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>                                                   
                            <div class="flex-1 space-y-1">
                                <p class="text-sm font-medium leading-none">{formatCurrency(product.price)}</p>
                                <p class="text-muted-foreground text-sm">
                                    All Variant
                                </p>
                            </div>
                            <!-- <Switch /> -->
                            </div>
                            <div>
                                <div
                                class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div class="space-y-1">
                                    <p class="text-sm font-medium leading-none">
                                        Ready
                                    </p>
                                </div>
                                </div>
                            </div>
                        </Card.Content>
                        <!-- <Card.Footer>
                            <Button class="w-full">
                            Mark all as read
                            </Button>
                        </Card.Footer> -->
                    </Card.Root>
                {/each}
            </div>
            {:else if showItemState == 'toping'}
            <div in:fly={{ x: -150, duration:500 }} class="grid grid-cols-1 w-full sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {#each data.topings as toping}
                    <Card.Root class="w-full p-2 bg-white shadow-lg shadow-indigo-50 hover:shadow-xl hover:shadow-indigo-100 transition-all group">
                        <Card.Header class="p-2">
                            <Card.Title class="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-indigo-200 group-hover:text-indigo-400">
                                    <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
                                </svg> 
                                <span class="no-underline group-hover:underline group-hover:decoration-indigo-300">
                                    {capitalizeFirstLetterOfEachWord(toping.name)}
                                </span>
                            </Card.Title>
                            <!-- <Card.Description>{capitalizeFirstLetter(toping.category?.name ?? '')}</Card.Description> -->
                        </Card.Header>
                        <Card.Content class="grid gap-2 p-2 pt-0">
                            <div class="flex items-center space-x-4 rounded-md border p-4 bg-neutral-50 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-lime-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>                                                   
                            <div class="flex-1 space-y-1">
                                <p class="text-sm font-medium leading-none">{formatCurrency(toping.price)}</p>
                            </div>
                            <!-- <Switch /> -->
                            </div>
                            <div>
                                <div
                                class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div class="space-y-1">
                                    <p class="text-sm font-medium leading-none">
                                        Ready
                                    </p>
                                </div>
                                </div>
                            </div>
                        </Card.Content>
                        <!-- <Card.Footer>
                            <Button class="w-full">
                            Mark all as read
                            </Button>
                        </Card.Footer> -->
                    </Card.Root>
                {/each}
            </div>
            {/if}
        {/if}
    </div>
</div>


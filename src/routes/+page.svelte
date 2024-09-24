<script lang="ts">
	import { capitalizeFirstLetterOfEachWord, formatCurrency } from "$lib";
	import { fly } from "svelte/transition";
    export let data
	import ProductCard from "$lib/components/ui/ProductCard.svelte";
	import Navbar from "$lib/components/ui/Navbar.svelte";


    let showItemState: 'menu'|'toping' = 'menu'
    const hideShowScrollBar = (state: 'in'|'out' = 'in') => {
		if(document) {
			switch (state) {
				case 'in': 
					document.body.style.overflowX = 'hidden'
				break
				case 'out':
					document.body.style.overflowX = 'visible'
				break
			}
		}
	}
    const menus = [
        {
            path: '/',
            label: 'Home'
        },
        {
            path: '/dashboard',
            label: 'Dashboard'
        }
    ]
</script>

<div class="p-4 flex flex-col gap-2 min-h-[100svh] w-full h-full bg-neutral-50">

    <Navbar {menus} />

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
                    <ProductCard>
                        <span slot="name">{product.name}</span>
                        <span slot="category">{capitalizeFirstLetterOfEachWord(product.category?.name ?? '')}</span>
                        <span slot="price">{formatCurrency(product.price)}</span>
                        <span slot="price_description">All Variant</span>
                        <span slot="status">Ready</span>
                    </ProductCard>
                {/each}
            </div>
            {:else if showItemState == 'toping'}
            <div in:fly={{ x: -150, duration:500 }} class="grid grid-cols-1 w-full sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {#each data.topings as toping}
                <ProductCard>
                    <span slot="name">{capitalizeFirstLetterOfEachWord(toping.name)}</span>
                    <span slot="price">{formatCurrency(toping.price)}</span>
                    <span slot="status">Ready</span>
                </ProductCard>
                {/each}
            </div>
            {/if}
        {/if}
    </div>
</div>


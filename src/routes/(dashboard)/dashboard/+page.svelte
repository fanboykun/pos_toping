<script lang="ts">
	import { formatDay, formatTime } from "$lib";
	import { onMount } from "svelte";
	import DashboardCard from "./(components)/DashboardCard.svelte";
	import LoadingState from "$lib/components/ui/LoadingState.svelte";

    export let data
    let currentTime: string

    // Function to get the current time in HH:MM format
    const getCurrentTime = () => {
        const t = new Date()
        return `${formatDay(t)} Pukul ${formatTime(t)}`
    }

    // Function to start updating the time precisely at the next minute
    const updateTimePrecisely = () => {
        currentTime = getCurrentTime();
        const now = new Date();
        const secondsUntilNextMinute = 60 - now.getSeconds();
        const millisecondsUntilNextMinute = secondsUntilNextMinute * 1000;

        // Set a timeout to update at the start of the next minute
        setTimeout(() => {
            currentTime = getCurrentTime();
            // After the first precise update, use setInterval for subsequent minute updates
            setInterval(() => {
                currentTime = getCurrentTime();
            }, 60000); // Update every 60,000 ms (1 minute)
        }, millisecondsUntilNextMinute); // Wait until the next minute starts
    }

    onMount(() => {
        updateTimePrecisely();
    });

    const productStat = {
        main: 30,
        secondary: 'Item',
        description: 'Total Produk'
    }

</script>

<div class="max-w-[85rem] px-4 pt-4 sm:px-6 lg:px-8 xl:pb-4 pb-[100px] mx-auto">
    <!-- Card -->
    <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-auto dark:bg-neutral-900 dark:border-neutral-700">
                    <!-- Header -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                        Dashboard
                        </h2>
                        <p class="text-sm text-gray-600 dark:text-neutral-400">
                        Rangkuman
                        <span class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium" >
                            Aplikasi
                        </span>
                        dari semua kegiatan 
                        </p>
                    </div>
        
                    <div>
                        <div class="inline-flex gap-x-2">
        
                        <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>                              
                             {currentTime ?? ''}
                        </button>
                        </div>
                    </div>
                    </div>
                    <!-- End Header -->

                      <!-- List -->
                    <div class="min-w-full grid grid-cols-2 max-[380px]:grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                        {#if data}
                        {#each data.stats as stat}
                            <DashboardCard {stat} />
                        {/each}
                        {/if}
                    </div>
                    <!-- End List -->

                </div>
            </div>
        </div>
    </div>
    <!-- End Card -->
</div>

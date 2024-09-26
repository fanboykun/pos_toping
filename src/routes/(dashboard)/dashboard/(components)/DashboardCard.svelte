<script lang="ts">
    export let stat: {
        main: string|number|undefined|null,
        secondary?: string|number|undefined|null
        description?: string        
    }
</script>

<div class="flex flex-col hover:shadow-lg hover:shadow-blue-200 bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl group ">
    <div class="p-4">
        <div class="bg-white border border-blue-600 w-fit rounded-lg p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>          
        </div>
      <p class="text-gray-500 font-bold text-xl">
        {stat.main}
        <span class="font-semibold text-lg">{stat?.secondary ?? 'Item'}</span>
      </p>
      <p class="text-gray-500 text-xs">
        {stat.description}
      </p>
    </div>
</div>

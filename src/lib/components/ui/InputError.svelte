<script lang="ts">
	import type { validated } from "ts-input-validator";

    export let error: validated

    const transformErrorMessage = (error: validated) => {
        return Object.values(error)
    }
</script>

<div class="flex flex-col gap-0">
    {#each transformErrorMessage(error) as errorMessage}
    <div class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 text-red-500">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
        </svg>                
        <span class="text-sm text-red-600 text-center">{errorMessage}</span>
    </div>
    {/each}
</div>
<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { capitalizeFirstLetterOfEachWord, createGradientAvatar, getFistCharFromName } from "$lib";
    import * as Avatar from "$lib/components/ui/avatar";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
    
    export let user: App.Locals["user"]
    export let shouldHideOnMobile = false

    let img: string|undefined
    onMount(() => {
        img = createGradientAvatar(document)
    })
    
    let processing = false
    const handleLogout: SubmitFunction = () => {
        processing = true
        return async ( { result, update } ) => {
              await update()
              processing = false
              if(result.type == "success" || result.type == "redirect") {
                toast.info('Berhasil Logout')
              }
          }
    }

</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger class="flex items-center justify-center text-center {shouldHideOnMobile ? 'hidden md:block' : ''}">
        <Avatar.Root class="h-6 w-6 sm:h-8 sm:w-8">
            <Avatar.Image src={img} alt="@shadcn" />
            <Avatar.Fallback>{getFistCharFromName(user?.name)}</Avatar.Fallback>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>{capitalizeFirstLetterOfEachWord(user?.name ?? '')}</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item class="flex">
            <form action="/?/logout" method="post" use:enhance={handleLogout} class="w-full h-full bg-transparent flex gap-1 items-center">
                <button type="submit" class="w-full h-full bg-transparent">Logout</button>
                {#if processing}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>       
                {/if}  
            </form>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
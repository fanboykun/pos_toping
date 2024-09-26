<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { ActionData } from "../$types";
	import { applyAction, enhance } from "$app/forms";

    export let userId: string|undefined
    export let isOpen = false
    export let form: ActionData
    export let onClose: Function

    let deleting = false

    const closeModal = () => {
        isOpen = !isOpen
        if(form?.result) form.result = {}  // reset the error if the modal closed
        return onClose()
    }

    const handleDeleteUser:  SubmitFunction = ( { formData, cancel } ) => {
        if(!userId) return cancel()
        formData.append('userId', userId)
        deleting = true
        return async ( { result, update } ) => {
            await update()
            deleting = false
            if(result.type == 'success') {
              onClose()
            }
            applyAction(result)
        }
    }


   </script>
    
<Dialog.Root open={isOpen} onOpenChange={closeModal}>
    <Dialog.Content>
        <Dialog.Header>
        <Dialog.Title>Apakah anda yakin?</Dialog.Title>
        <Dialog.Description>
            Data yang telah di hapus akan terhapus secara permanen
        </Dialog.Description>
        </Dialog.Header>
        <form action="?/deleteUser" method="post" use:enhance={handleDeleteUser}>
            <Dialog.Footer class="flex gap-2 items-center justify-between">
                <Button variant="outline" type="button" on:click={closeModal}>Cancel</Button>
                <Button variant="destructive" type="submit" disabled={deleting}>
                    Delete
                    {#if deleting}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>       
                    {/if}  
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>


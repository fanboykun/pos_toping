<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { ActionData } from "../$types";
	import { applyAction, enhance } from "$app/forms";

    export let productId: string|undefined
    export let isOpen = false
    export let form: ActionData
    export let onClose: Function

    let deleting = false

    const closeModal = () => {
        isOpen = !isOpen
        if(form?.result) form.result = {}  // reset the error if the modal closed
        return onClose()
    }

    const handleDeleteProduct:  SubmitFunction = ( { formData, cancel } ) => {
        if(!productId) return cancel()
        formData.append('productId', productId)
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
        <form action="?/deleteProduct" method="post" use:enhance={handleDeleteProduct}>
            <Dialog.Footer class="flex gap-2 items-center justify-between">
                <Button variant="outline" type="button" on:click={closeModal}>Cancel</Button>
                <Button variant="destructive" type="submit">Delete</Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>


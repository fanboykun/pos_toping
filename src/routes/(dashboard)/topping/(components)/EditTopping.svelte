<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
	import type { Toping } from "@prisma/client";
	import { applyAction, enhance } from "$app/forms";
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from "../$types";
	import InputError from "$lib/components/ui/InputError.svelte";

  export let form: ActionData
  export let isOpen: boolean = false
  export let onClose: Function
  export let topping: Toping

  const closeModal = () => {
    isOpen = !isOpen
    if(form?.result) form.result = {}  // reset the error if the modal closed
    return onClose()
  }

  let updating = false

  const handleEditTopping: SubmitFunction = ( { formData, cancel } ) => {
      if(!topping) return cancel()
      updating = true
      formData.append('id', topping.id)

      return async ( { result, update } ) => {
          await update()
          updating = false
          if(result.type == 'success') {
            onClose()
          }
          applyAction(result)
      }
  }


</script>

<Dialog.Root open={isOpen} onOpenChange={closeModal}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Update Topping</Dialog.Title>
        <Dialog.Description>
          Edit data topping
        </Dialog.Description>
      </Dialog.Header>
      <form method="post" action="?/editTopping" use:enhance={handleEditTopping} id="editTopping">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            {#if form?.result?.id?.valid == false}
              <InputError error={form?.result?.id?.message} />
            {/if}
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Nama</Label>
            <Input id="name" name="name" placeholder="Nama Topping" value={topping?.name ?? ''} />
            {#if form?.result?.name?.valid == false}
              <InputError error={form?.result?.name?.message} />
            {/if}
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="price">Harga</Label>
            <Input id="price" name="price" placeholder="Harga Topping" type="number" value={topping?.price} />
            {#if form?.result?.price?.valid == false}
              <InputError error={form?.result?.price?.message} />
            {/if}
          </div>
        </div>
        <Dialog.Footer class="flex justify-between mt-4">
          <Button variant="outline" on:click={closeModal}>Batal</Button>
          <Button type="submit" disabled={updating} class="flex gap-1">
            <span>Update</span>
            {#if updating}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>       
            {/if}     
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>



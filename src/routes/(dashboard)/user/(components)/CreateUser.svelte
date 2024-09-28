<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
	import { applyAction, enhance } from "$app/forms";
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from "../$types";
	import InputError from "$lib/components/ui/InputError.svelte";

  export let form: ActionData
  export let isOpen: boolean = false
  export let onClose: Function

  const closeModal = () => {
    isOpen = !isOpen
    if(form?.result) form.result = {}  // reset the error if the modal closed
    return onClose()
  }

  let creating = false

  const handleAddUser: SubmitFunction = ( { formData } ) => {
          creating = true
          return async ( { result, update } ) => {
              await update()
              creating = false
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
        <Dialog.Title>Tambah User</Dialog.Title>
        <Dialog.Description>
          Tambah Pengguna Baru
        </Dialog.Description>
      </Dialog.Header>
      <form method="post" action="?/addUser" use:enhance={handleAddUser} id="addUser">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Nama</Label>
            <Input id="name" name="name" placeholder="Nama User" />
            {#if form?.result?.name?.valid == false}
              <InputError error={form?.result?.name?.message} />
            {/if}
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Email" />
            {#if form?.result?.email?.valid == false}
              <InputError error={form?.result?.email?.message} />
            {/if}
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Password User" />
            {#if form?.result?.password?.valid == false}
              <InputError error={form?.result?.password?.message} />
            {/if}
          </div>
        </div>
        <Dialog.Footer class="flex justify-between mt-4">
          <Button variant="outline" on:click={closeModal}>Batal</Button>
          <Button type="submit" disabled={creating} class="flex gap-1">
            <span>Simpan</span>
            {#if creating}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>       
            {/if}     
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>



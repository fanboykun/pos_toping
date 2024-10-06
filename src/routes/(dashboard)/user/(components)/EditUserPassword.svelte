<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
	import type { User } from "@prisma/client";
	import { applyAction, enhance } from "$app/forms";
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from "../$types";
	import InputError from "$lib/components/ui/InputError.svelte";
	import { tick } from "svelte";

  type UserWithoutPassword = Omit<User, 'password'>
  export let form: ActionData
  export let isOpen: boolean = false
  export let onClose: Function
  export let user: UserWithoutPassword

  const closeModal = () => {
    isOpen = !isOpen
    if(form?.result) form.result = {}  // reset the error if the modal closed
    return onClose()
  }

  let updating = false

  const handleChangeUserPassword: SubmitFunction = ( { formData, cancel } ) => {
      if(!user) return cancel()
      updating = true
      formData.append('id', user.id)

      return async ( { result, update } ) => {
        await update()
        await tick(); // Ensure UI reactivity
        updating = false
        if(result.type == 'success') {
          onClose()
        }
      }
  }


</script>

<Dialog.Root open={isOpen} onOpenChange={closeModal}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Update User Password</Dialog.Title>
        <Dialog.Description>
          Edit Password <span class="font-semibold">{user.name}</span>
        </Dialog.Description>
      </Dialog.Header>
      <form method="post" action="?/changeUserPassword" use:enhance={handleChangeUserPassword} id="changeUserPassword">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            {#if form?.result?.id?.valid == false}
              <InputError error={form?.result?.id?.message} />
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



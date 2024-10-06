<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select/index";
	import type { Category } from "@prisma/client";
	import { capitalizeFirstLetterOfEachWord } from '$lib';
	import { applyAction, enhance } from "$app/forms";
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from "../$types";
	import InputError from "$lib/components/ui/InputError.svelte";

  export let form: ActionData
  export let isOpen: boolean = false
  export let categories: Category[]
  export let onClose: Function
  let selectedcatId: string = ''

  const closeModal = () => {
    isOpen = !isOpen
    if(form?.result) form.result = {}  // reset the error if the modal closed
    return onClose()
  }

  let creating = false

  const handleAddProduct: SubmitFunction = ( { formData } ) => {
          creating = true
          return async ( { result, update } ) => {
            if(result.type == 'success') {
              await update()
              onClose()
            }
            creating = false
          }
  }


</script>

<Dialog.Root open={isOpen} onOpenChange={closeModal}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Tambah Product</Dialog.Title>
        <Dialog.Description>
          Tambah Produk Baru
        </Dialog.Description>
      </Dialog.Header>
      <form method="post" action="?/addProduct" use:enhance={handleAddProduct} id="addProduct">
        <div class="grid w-full items-center gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Nama</Label>
            <Input id="name" name="name" placeholder="Nama Produk" />
            {#if form?.result?.name?.valid == false}
              <InputError error={form?.result?.name?.message} />
            {/if}
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="price">Harga</Label>
            <Input id="price" name="price" placeholder="Harga Produk" type="number" />
            {#if form?.result?.price?.valid == false}
              <InputError error={form?.result?.price?.message} />
            {/if}
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="categoryId">Kategori</Label>
            <Select.Root name="categoryId">
              <Select.Input name="categoryId" bind:value={selectedcatId} />
              <Select.Trigger id="categoryId" name="categoryId" value={form?.categoryId ?? ''}>
                <Select.Value placeholder="Select" />
              </Select.Trigger>
              <Select.Content>
                {#each categories as category}
                  <Select.Item value={category.id} label={capitalizeFirstLetterOfEachWord(category.name)}>
                    {capitalizeFirstLetterOfEachWord(category.name)}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
            {#if form?.result?.categoryId?.valid == false}
              <InputError error={form?.result?.categoryId?.message} />
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



<script lang="ts">
	import type { User } from "@prisma/client";
	import { browser } from '$app/environment';
	import { capitalizeFirstLetterOfEachWord, createGradientAvatar, getFistCharFromName } from '$lib';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import TableEmptyState from '$lib/components/ui/TableEmptyState.svelte';
	import UserCard from './(components)/UserCard.svelte';
  import * as Avatar from "$lib/components/ui/avatar";
	import CreateUser from "./(components)/CreateUser.svelte";
	import DeleteUser from "./(components)/DeleteUser.svelte";
	import EditUser from "./(components)/EditUser.svelte";
	import EditUserPassword from "./(components)/EditUserPassword.svelte";

  export let data
  export let form

let isDeleteUserModalOpen = false
let isAddUserModalOpen = false
let isEditUserModalOpen = false
let isChangePasswordUserModalOpen = false

let selectedUser: User

  const onActionModalCLose = (modal: 'add'|'delete'|'edit'|'change') => {
    switch (modal) {
      case 'add' :
        isAddUserModalOpen = false;
        break
      case 'delete' :
        isDeleteUserModalOpen = false;
        break
      case 'edit' :
        isEditUserModalOpen = false;
        break
      case 'change' :
        isChangePasswordUserModalOpen = false;
        break
    }
  }

</script>

{#await data.users}
    <LoadingState />
{:then users} 
  <!-- Table Section -->
  <div class="max-w-[85rem] px-4 pt-4 sm:px-6 lg:px-8 xl:pb-4 pb-[100px] mx-auto">
      <!-- Card -->
      <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
          <div class="p-1.5 min-w-full inline-block align-middle">
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm">

              <!-- Header -->
              <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800 ">
                    User List
                  </h2>
                  <p class="text-sm text-gray-600">
                    Semua
                    <span class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium" >
                      Pengguna
                  </span>
                    yang telah dibuat ditampilkan dibawah 
                  </p>
                </div>
    
                <div>
                  <div class="inline-flex gap-x-2">
    
                    <button type="button" on:click={() => isAddUserModalOpen = true} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                      <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
              <!-- End Header -->

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  {#if users}
                  {#each users as user }
                  <!-- List -->
                  <UserCard>
                      <div slot="avatar" class="flex h-full flex-col items-start justify-start">
                          <Avatar.Root class="h-6 w-6 sm:h-8 sm:w-8 mt-4">
                              {#if browser}
                              {@const img = createGradientAvatar(document)}
                              <Avatar.Image src={img} alt="avatar" />
                              {/if}
                              <Avatar.Fallback>{getFistCharFromName(user.name)}</Avatar.Fallback>
                          </Avatar.Root>

                      </div>
                      <span slot="name">{capitalizeFirstLetterOfEachWord(user.name)}</span>
                      <span slot="email">{user.email}</span>
                      <span slot="role">{user.isAdmin ? 'Admin' : 'User'}</span>
                      <div slot="actions" class="flex w-full items-center justify-between mt-2">
                        <button type="button" on:click={() => { isChangePasswordUserModalOpen = true; selectedUser = user } } class="flex w-full h-full items-center justify-start">
                          <span class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-2.5">
                              <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                            </svg>                            
                            Ganti Password
                          </span>
                        </button>
                        <div class="flex gap-x-2">
                          <button type="button" on:click={() => { isDeleteUserModalOpen = true; selectedUser = user }} class="p-2 inline-flex items-center gap-x-0 text-sm font-semibold rounded-lg border border-red-400 text-red-600 decoration-2 hover:text-red-100 hover:bg-red-600 focus:shadow-md disabled:opacity-50 disabled:pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>                      
                          </button>
                          <button type="button" on:click={() => { isEditUserModalOpen = true; selectedUser = user }} class="p-2 inline-flex items-center gap-x-0 text-sm font-semibold rounded-lg border border-blue-400 text-blue-600 decoration-2 hover:text-blue-100 hover:bg-blue-600 focus:shadow-md disabled:opacity-50 disabled:pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="shrink-0 size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>                      
                          </button>
                        </div>
                      </div>
                  </UserCard>
                  <!-- EndList -->
                  {/each}
                  {:else}
                  <TableEmptyState />
                  {/if}
              </div>

          </div>
      </div>
    </div>
  </div>
  <!-- End Card -->
  </div>
  <!-- End Table Section -->
  <!-- Modal Section -->
<CreateUser {form} isOpen={isAddUserModalOpen} onClose={() => onActionModalCLose('add')} />
<DeleteUser isOpen={isDeleteUserModalOpen} userId={selectedUser?.id} {form} onClose={() => onActionModalCLose('delete')} />
<EditUser user={selectedUser} {form} isOpen={isEditUserModalOpen} onClose={() => onActionModalCLose('edit')} />
<EditUserPassword user={selectedUser} {form} isOpen={isChangePasswordUserModalOpen} onClose={() => onActionModalCLose('change')} />
   <!-- End Modal Section -->
{:catch}
  <ErrorState />
{/await}



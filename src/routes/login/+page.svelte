<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import InputError from "$lib/components/ui/InputError.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { toast } from "svelte-sonner";

    export let form
    
    $: {
      if(form?.success != undefined) {
          let isSuccess = form.success as boolean
          let toastMessage = isSuccess ? 'The Action Executed Successfully' : 'The Action Failed to Execute'
          if(form.message && typeof form.message === 'string') toastMessage = form.message
          toast(isSuccess ? 'Success' : 'Failed', {
              description: toastMessage,
          })
      }
  }
    
    let isPasswordShown = false
    $: passwordInputType = isPasswordShown ? 'text' : 'password' as 'password'|'text'
    
    let processing = false
    const handleLogin: SubmitFunction = ( { formData } ) => {
        processing = true
        return async ( { result, update } ) => {
            processing = false
            await update()
            if(result.type == "redirect") {
              toast('Success', {
                description: 'Selamat Datang',
              })
              return goto(result.location)
            }
        }
    }


</script>
<div class="w-full min-h-[100svh] flex bg-neutral-50 mx-auto items-center justify-center px-4">
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-sm p-4">
        <div class="p-4 sm:p-7">
          <div class="text-center">
            <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Log in</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Mohon isi form untuk login ke akun anda
            </p>
          </div>
      
          <div class="mt-5">
      
            <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600"></div>
      
            <!-- Form -->
            <form method="post" action="?/login" use:enhance={handleLogin} id="login">
                <div class="grid w-full items-center gap-4">
                  <div class="flex flex-col space-y-1.5">
                    <Label for="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Email anda" required autocomplete="email" />
                    {#if form?.result?.email?.valid == false}
                      <InputError error={form?.result?.email?.message} />
                    {/if}
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <Label for="password">Password</Label>
                    <div class="flex gap-x-2">
                        <Input id="password" name="password" placeholder="Password" type={passwordInputType} required />
                        <button type="button" class="border rounded-lg px-2" on:click={() => isPasswordShown = !isPasswordShown}>
                            {#if isPasswordShown}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>        
                            {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>        
                            {/if}
                        </button>
                    </div>
                    {#if form?.result?.password?.valid == false}
                      <InputError error={form?.result?.password?.message} />
                    {/if}
                  </div>
                </div>

                <div class="flex mt-4 w-full">
                    <button type="submit" disabled={processing} class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Log in
                        {#if processing}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 animate-spin">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>    
                        {/if}
                    </button>
                </div>

              </form>
            <!-- End Form -->
          </div>
        </div>
    </div>
</div>
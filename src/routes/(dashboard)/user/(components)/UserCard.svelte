<script lang="ts">

</script>

<div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border  p-2 rounded-lg">
  {#if $$slots.avatar}
    <slot name="avatar" />
  {/if}

  <div class="grow">
    <div>
      <h3 class="font-medium text-gray-800 dark:text-neutral-200">
        <slot name="name" />
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500">
        <slot name="email" />
      </p>
      <p class="mt-1 text-xs uppercase text-gray-500 dark:text-neutral-500">
        <slot name="role" />
      </p>
    </div>

    <!-- Social Brands -->
    <div class="mt-2 sm:mt-auto space-x-2.5">
      {#if $$slots.actions}
      <slot name="actions" />
      {/if}
    </div>
    <!-- End Social Brands -->
  </div>
</div>
<script lang="ts">
	import Navbar from "$lib/components/ui/Navbar.svelte";

  const menus = [
    {
      path: '/dashboard',
      label: 'Dashboard',
    },
    {
      path: '/order',
      label: 'Order',
    },
    {
      path: '/product',
      label: 'Product',
    },
    {
      path: '/topping',
      label: 'Topping',
    },
    {
      path: '/category',
      label: 'Category',
    },
    {
      path: '/user',
      label: 'User',
    }
  ]

</script>
<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<Navbar {menus} />

<slot />


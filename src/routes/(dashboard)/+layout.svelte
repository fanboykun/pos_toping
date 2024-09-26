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
    }
  ]
  export let data

  if(data.user?.isAdmin) {
    menus.push({
      path: '/user',
      label: 'User',
    })
  }

</script>
<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<Navbar {menus} user={data.user} />

<slot />


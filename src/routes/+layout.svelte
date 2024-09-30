<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';
</script>

<svelte:head>
	<title>POS</title>
</svelte:head>
<Toaster closeButton position="top-center" richColors />
<slot />

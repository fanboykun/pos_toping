<script>
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ProgressBar } from "@prgm/sveltekit-progress-bar";
</script>

<svelte:head>
	<title>POS</title>
</svelte:head>
<ProgressBar class="text-indigo-500" />
<Toaster closeButton position="top-center" richColors />
<slot />

<script lang="ts">
	import { page } from '$app/stores';
    const emojis = {
        // TODO add the rest!
        420: '🫠',
        500: '💥'
    } as const

    const getEmoji = (status: number) => {
        return emojis[status as keyof typeof emojis] ?? emojis[500]
    }
    
</script>

<h1>{$page.status} {$page?.error?.message}</h1>
<span style="font-size: 10em">
	{getEmoji($page.status)}
</span>

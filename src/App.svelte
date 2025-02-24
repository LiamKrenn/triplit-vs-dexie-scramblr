<script lang="ts">
	import { seedDexie, fetchTodosFromDexie } from './dexie';
	import { seedTriplit, fetchTodosFromTriplit } from './triplit';

	let lastDexieSeedRun: number | null = $state(null);
	let lastTriplitSeedRun: number | null = $state(null);
	let lastDexieFetchRun: number | null = $state(null);
	let lastTriplitFetchRun: number | null = $state(null);
</script>

<main>
	<div>
		Dexie
		<button
			onclick={async () => {
				lastDexieSeedRun = await seedDexie();
			}}>Seed Dexie</button
		>
		<div>Last run took {lastDexieSeedRun}ms</div>

		<button
			onclick={async () => {
				lastDexieFetchRun = await fetchTodosFromDexie();
			}}>Fetch Todos from Dexie</button
		>
		<div>Last run took {lastDexieFetchRun}ms</div>
	</div>
	<div>
		Triplit
		<button
			onclick={async () => {
				lastTriplitSeedRun = await seedTriplit();
			}}>Seed Triplit</button
		>
		<div>Last run took {lastTriplitSeedRun}ms</div>
		<button
			onclick={async () => {
				lastTriplitFetchRun = await fetchTodosFromTriplit();
			}}>Fetch Todos from Triplit</button
		>
		<div>Last run took {lastTriplitFetchRun}ms</div>
	</div>
</main>

<style>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
	.read-the-docs {
		color: #888;
	}
</style>

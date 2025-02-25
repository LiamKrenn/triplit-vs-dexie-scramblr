<script lang="ts">
  import {
    seedDexie,
    fetchTimesFromDexie,
    fetchTimesComplexFromDexie,
  } from "./dexie";
  import {
    seedTriplit,
    fetchTimesFromTriplit,
    fetchTimesComplexFromTriplit,
  } from "./triplit";
  import {
    seedPGLite,
    fetchTimesFromPGLite,
    fetchTimesComplexFromPGLite,
  } from "./pglite";

  let lastDexieSeedRun: number | null = $state(null);
  let lastDexieFetchRun: number | null = $state(null);
  let lastDexieFetchComplexRun: number | null = $state(null);

  let lastTriplitSeedRun: number | null = $state(null);
  let lastTriplitFetchRun: number | null = $state(null);
  let lastTriplitFetchComplexRun: number | null = $state(null);

  let lastPGLiteSeedRun: number | null = $state(null);
  let lastPGLiteFetchRun: number | null = $state(null);
  let lastPGLiteFetchComplexRun: number | null = $state(null);
</script>

<main>
  <div>
    <h2>Dexie</h2>
    <button
      onclick={async () => {
        lastDexieSeedRun = await seedDexie();
      }}>Seed</button
    >
    <div>{lastDexieSeedRun}ms</div>

    <button
      onclick={async () => {
        lastDexieFetchRun = await fetchTimesFromDexie();
      }}>Fetch Times</button
    >
    <div>{lastDexieFetchRun}ms</div>

    <button
      onclick={async () => {
        lastDexieFetchComplexRun = await fetchTimesComplexFromDexie();
      }}>Fetch 'Complex' Times</button
    >
    <div>{lastDexieFetchComplexRun}ms</div>
  </div>
  <div>
    <h2>Triplit</h2>
    <button
      onclick={async () => {
        lastTriplitSeedRun = await seedTriplit();
      }}>Seed</button
    >
    <div>{lastTriplitSeedRun}ms</div>
    <button
      onclick={async () => {
        lastTriplitFetchRun = await fetchTimesFromTriplit();
      }}>Fetch Times</button
    >
    <div>{lastTriplitFetchRun}ms</div>

    <button
      onclick={async () => {
        lastTriplitFetchComplexRun = await fetchTimesComplexFromTriplit();
      }}>Fetch 'Complex' Times</button
    >
    <div>{lastTriplitFetchComplexRun}ms</div>
  </div>

  <div>
    <h2>PGLite</h2>
    <button
      onclick={async () => {
        lastPGLiteSeedRun = await seedPGLite();
      }}>Seed</button
    >
    <div>{lastPGLiteSeedRun}ms</div>
    <button
      onclick={async () => {
        lastPGLiteFetchRun = await fetchTimesFromPGLite();
      }}>Fetch Times</button
    >
    <div>{lastPGLiteFetchRun}ms</div>

    <button
      onclick={async () => {
        lastPGLiteFetchComplexRun = await fetchTimesComplexFromPGLite();
      }}>Fetch 'Complex' Times</button
    >
    <div>{lastPGLiteFetchComplexRun}ms</div>
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }

  main > div {
    margin-bottom: 3rem;
  }

  main > div > h2 {
    margin-bottom: 1rem;
  }

  main > div > div {
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
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

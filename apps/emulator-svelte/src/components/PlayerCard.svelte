<script lang="ts">
  import type { SOS } from "sos-plugin-types";
  import { tweened } from "svelte/motion";
  import { state } from "../state";
  import { Color } from "./color";
  import EditPlayer from "./EditPlayer.svelte";
  export let player: SOS.Player["id"];

  let color = $state.players[player].team ? Color.orange : Color.blue;

  let rowNumber = 1;
  let editing = false;

  const boostStore = tweened($state.players[player].boost, {
    duration: 0,
  });

  $: $state.players[player].boost = Math.floor($boostStore);
  $: rowNumber =
    color === Color.blue
      ? $state.players[player].shortcut + 1
      : $state.players[player].shortcut % 3;
</script>

<div
  class="container column"
  style:grid-column-start={color === Color.orange ? 2 : 1}
  style:grid-row-start={rowNumber}
  style:border-color={color === Color.orange ? "var(--orange)" : "var(--blue)"}>
  <span
    >Name: <strong>{$state.players[player].name}</strong><span class="fade"
      >_{$state.players[player].shortcut}</span
    ></span>
  <span>Boost: <strong>{$state.players[player].boost}</strong></span>
  <div class="break" />
  <div class="container">
    <button
      on:click={() => {
        boostStore.set(0, { duration: $boostStore * 20 });
      }}>Use Boost</button>
    <button
      on:click={() => {
        boostStore.set(Math.min(100, $boostStore + 12), {});
      }}>Give Pad</button>
    <button
      on:click={() => {
        boostStore.set(100);
      }}>Give Can</button>
  </div>
  <div class="container">
    <button
      on:click={() => {
        $state.game.target = player;
      }}>Set as Target</button>
    <button
      on:click={() => {
        editing = true;
      }}>Edit Player</button>
  </div>
</div>

{#if editing}
  <EditPlayer {player} stopEditing={() => (editing = false)} />
{/if}

<style>
  span {
    font-weight: normal;
  }
  strong {
    font-weight: bolder;
  }
  .break {
    flex-basis: 100%;
    height: 0;
  }
  .container {
    border-radius: 0.4em;
  }
  .column {
    flex-direction: column;
    border: solid 0.3em;
    padding: 0.5em;
  }
  button {
    font-size: medium;
  }
  .fade {
    opacity: 50%;
  }
</style>

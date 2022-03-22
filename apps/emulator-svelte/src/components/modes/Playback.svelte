<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { socket } from "../../socket";
  import { state } from "../../state";
  import WssError from "../errors/Wss.svelte";
  import SelectInput from "../inputs/SelectInput.svelte";
  import { writable } from "svelte/store";
  import { gameId, stat } from "../../stores";

  onMount(async () => {
    $socket = {
      channel: "get-playback-library",
      data: null,
    };

    await tick();

    $socket = {
      channel: "open-wss",
      data: null,
    };

    $state.playback.loaded = false;

    if (!$state.playback.listOfGameIds?.length) {
      $state.playback.listOfGameIds = [];
      $state.playback.gameId = "No games found!";
    }
    await tick();
    $socket = {
      channel: "load-playback",
      data: $state.playback.gameId,
    };
  });

  onDestroy(() => {
    $state.emulator.playing = false;
    $socket = {
      channel: "stop-playback",
      data: null,
    };
  });

  let dragging = false;

  const current = writable(0);

  $: if ($socket.channel === "playback-library" && $socket.data?.length) {
    $state.playback.listOfGameIds = $socket.data;
    $state.playback.gameId = $socket.data[0];
    $state.playback.loaded = true;
  }
  $: if ($socket.channel === "playback-started") {
    $state.emulator.playing = true;
  }
  $: if ($socket.channel === "playback-stopped") {
    $state.emulator.playing = false;
  }

  $: if ($socket.channel === "playback-current-frame") {
    $state.playback.currentFrame = $socket.data;
  }

  $: if ($socket.channel === "playback-length") {
    $state.playback.length = $socket.data;
  }

  $: if ($socket.channel === "playback-loaded") {
    $state.playback.length = $socket.data;
    $state.playback.currentFrame = 0;
  }

  $: if (!dragging) current.set($state.playback.currentFrame);
</script>

<WssError />
<div class="grid">
  <SelectInput
    bind:value={$state.playback.gameId}
    on:change={() => {
      $socket = {
        channel: "load-playback",
        data: $state.playback.gameId,
      };
    }}
    label="Selected Game"
    options={$state.playback.listOfGameIds}
    code />
  {#if $state.emulator.playing}
    <button
      on:click={() => {
        $socket = {
          channel: "stop-playback",
          data: null,
        };
      }}>Stop Playing</button>
  {:else}
    <button
      on:click={async () => {
        if (!$state.playback.loaded) {
          $socket = {
            channel: "load-playback",
            data: $state.playback.gameId,
          };
          $state.game.ticking = false
          await tick();
        }
        $socket = {
          channel: "start-playback",
          data: null,
        };
      }}>Start Playing</button>
  {/if}

  <span
    >Frame {$state.playback?.currentFrame ?? 0} of {$state.playback?.length ??
      0}</span>
  <input
    type="range"
    min="0"
    max={$state.playback?.length ?? 0}
    bind:value={$current}
    on:mousedown={() => {
      dragging = true;
    }}
    on:mouseup={() => {
      dragging = false;
      $socket = {
        channel: "set-playback-current-frame",
        data: $current,
      };
    }} />
</div>

<style>
  .grid {
    padding-top: 1em;
    grid-template-columns: 10em 25em 10em;
    align-items: baseline;
  }
  button {
    position: relative;
    top: 0.15em;
  }

  input {
    grid-column-end: 4;
    grid-column-start: 1;
    padding-right: 1em;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border-radius: 0;
    width: 0.3em;
    height: 1em;
    background-color: green;
    position: relative;
    top: -0.25em;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background-color: var(--purple);
    height: 0.5em;
  }
</style>

<script lang="ts">
  import { readonlyArray as RA } from "fp-ts";
  import { function as f } from "fp-ts";
  import { array as A } from "fp-ts";
  import { option as O } from "fp-ts";
  import { either as E } from "fp-ts";
  import { map as M } from "fp-ts";
  import { task as T } from "fp-ts";
  import { taskEither as TE } from "fp-ts";
  import { ord as Ord } from "fp-ts";
  import { eq as Eq } from "fp-ts";
  import { record as R } from "fp-ts";
  import { string as Str } from "fp-ts";
  import { state as S } from "fp-ts";
  import { set as FSet } from "fp-ts";
  import { date as FDate } from "fp-ts";

  import { onDestroy, onMount, tick } from "svelte";
  import { socket } from "../../socket";
  import { state } from "../../state";
  import WssError from "../errors/Wss.svelte";
  import SelectInput from "../inputs/SelectInput.svelte";
  import { derived, Readable, writable } from "svelte/store";
  import { getLogger } from "../../logger";
  import type { DatedPacket, SOS } from "sos-plugin-types";
  import { playback } from "../../stores";

  const log = getLogger({
    filepath: import.meta.url,
  });

  onMount(async () => {
    socket.set({
      channel: "get-playback-library",
      data: null,
    });

    await tick();

    socket.set({
      channel: "open-wss",
      data: null,
    });

    $state.playback.loaded = false;

    if (!$state.playback.listOfGameIds?.length) {
      $state.playback.listOfGameIds = [];
      $state.playback.gameId = "No games found!";
    }
    await tick();
    socket.set({
      channel: "load-playback",
      data: $state.playback.gameId,
    });
  });

  onDestroy(() => {
    $state.emulator.playing = false;
    socket.set({
      channel: "stop-playback",
      data: null,
    });
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
    log.info("playback-loaded", $socket.data.length);
    $state.playback.length = $socket.data.length;
    $state.playback.currentFrame = 0;
    $state.playback.statPackets = $socket.data.statEvents ?? [];
  }

  $: if (!dragging) current.set($state.playback.currentFrame);
</script>

<WssError />
<div class="grid">
  <SelectInput
    bind:value={$state.playback.gameId}
    on:change={() => {
      socket.set({
        channel: "load-playback",
        data: $state.playback.gameId,
      });
    }}
    label="Selected Game"
    options={$state.playback.listOfGameIds}
    code />
  {#if $state.emulator.playing}
    <button
      on:click={() => {
        socket.set({
          channel: "stop-playback",
          data: null,
        });
      }}>Stop Playing</button>
  {:else}
    <button
      on:click={async () => {
        if (!$state.playback.loaded) {
          socket.set({
            channel: "load-playback",
            data: $state.playback.gameId,
          });
          await tick();
        }
        $state.game.ticking = false;

        socket.set({
          channel: "start-playback",
          data: null,
        });
      }}>Start Playing</button>
  {/if}

  <div class="frame-number">
    Frame {$state.playback?.currentFrame ?? 0} of {$state.playback?.length ?? 0}
  </div>
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
      socket.set({
        channel: "set-playback-current-frame",
        data: $current,
      });
    }} />
</div>
<div>
  <h3>Events</h3>

  <div class="event-list">
    {#each $state.playback.statPackets ?? [] as statEvent}
      <div
        class="stat-time"
        on:click={() => {
          socket.set({
            channel: "set-playback-current-frame",
            data: statEvent.i - 1,
          });
        }}>
        {statEvent.gameTime ?? 0} - {statEvent.i}
      </div>
      <div class="stat-team">
        {statEvent.data.main_target.team_num ? "O" : "B"}
      </div>
      <div class="stat-type">{statEvent.data.type}</div>
      <div class="stat-player">{statEvent.data.main_target.name}</div>
    {/each}
  </div>
</div>

<style>
  .frame-number {
    grid-column-start: 1;
    grid-column-end: 4;
  }
  .event-list {
    display: grid;
    grid-template-columns: 10em 1em 10em 1fr;
    grid-gap: 0.5em;
  }
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

<script lang="ts">
  import CollapsiblePanel from "./components/CollapsiblePanel.svelte";
  import { EmulatorMode, state } from "./state";
  import Player from "./components/PlayerCard.svelte";
  import { keys } from "fp-ts/lib/Record";
  import { onMount } from "svelte";
  import { getPlayerStore } from "./packetFactory/utils/getPlayerStore";
  import GameState from "./components/settings/GameState.svelte";
  import Manual from "./components/modes/Manual.svelte";
  import Playback from "./components/modes/Playback.svelte";
  import Recording from "./components/modes/Recording.svelte";
  import { socket } from "./socket";
  import { sendPacket } from "./sendPacket";
  import { derived } from "svelte/store";
  import { SOS, sosEvents } from "sos-plugin-types";
  import { pipe } from "fp-ts/lib/function";
  import { array as A } from "fp-ts";
  const gameTick = () => {
    const dt = Date.now() - $state.game.lastTick;
    if (!$state.game.ticking) {
      requestAnimationFrame(gameTick);
      return;
    }

    if (dt > 1000 && $ticking) {
      $state.game.lastTick = Date.now();
      $state.game.time += $state.game.isOT ? 1 : -1;
      sendPacket("game:clock_updated_seconds");
      sendPacket("game:update_state");
    }

    console.log("lastTick", dt);
    requestAnimationFrame(gameTick);
  };

  const ticking = derived(state, ($state) => $state.game.ticking);
  if (!$state.game.lastTick) $state.game.lastTick = 0;

  $: if ($ticking) sendPacket("game:clock_started");
  $: if (!$ticking) sendPacket("game:clock_stopped");

  onMount(() => {
    if (!$state.ui.packetWeights) {
      $state.ui.packetWeights = pipe(
        [...sosEvents],
        A.reduce({} as Record<SOS.Event, number>, (acc, event) => {
          return {
            ...acc,
            [event]: 1,
          };
        })
      );
    }
    if (!$state.game.time && $state.game.time !== 0) $state.game.time = 300;
    $state.game.ticking = false;
    gameTick();
    if (keys($state.players).length === 0) {
      const playerStore = getPlayerStore();
      for (let player in playerStore) {
        $state.players[player] = playerStore[player];
      }
    }

    if (!$state.emulator.mode) $state.emulator.mode = EmulatorMode.manual;
  });

  $: if ($socket.channel === "wss-port-busy") {
    $state.ui.wssError = true;
  }

  $: if ($socket.channel === "wss-open") {
    $state.ui.wssError = false;
  }

  $: if ($socket.channel === "recording-no-server") {
    $state.ui.recordingListenerError = true;
  }

  $: if ($socket.channel === "recording-started") {
    $state.ui.recordingListenerError = false;
  }

  $: if ($socket.channel === `new-connection`) {
    console.log("new connection");
    sendPacket("game:update_state");
  }
</script>

<CollapsiblePanel header="Emulator Controls" uiKey="emulatorModeOpen">
  <button
    class="mode"
    disabled={$state.emulator.mode === EmulatorMode.manual}
    on:click={() => ($state.emulator.mode = EmulatorMode.manual)}
    >Manual</button>
  <button
    class="mode"
    disabled={$state.emulator.mode === EmulatorMode.recording}
    on:click={() => ($state.emulator.mode = EmulatorMode.recording)}
    >Recording</button>
  <button
    class="mode"
    disabled={$state.emulator.mode === EmulatorMode.playback}
    on:click={() => ($state.emulator.mode = EmulatorMode.playback)}
    >Playback</button>

  {#if $state.emulator.mode === EmulatorMode.manual}
    <Manual />
  {/if}
  {#if $state.emulator.mode === EmulatorMode.playback}
    <Playback />
  {/if}
  {#if $state.emulator.mode === EmulatorMode.recording}
    <Recording />
  {/if}
</CollapsiblePanel>
{#if $state.emulator.mode === EmulatorMode.manual}
  <GameState />

  <CollapsiblePanel header="Players" uiKey="playersOpen">
    <div class="grid players">
      {#each keys($state.players) as player}
        <Player {player} />
      {:else}
        ...
      {/each}
    </div>
  </CollapsiblePanel>
{/if}

<style>
  button.mode:disabled {
    background-color: var(--neutral);
    color: black;
  }
  .players {
    grid-template-columns: repeat(2, 45%);
    grid-auto-flow: dense;
  }
</style>

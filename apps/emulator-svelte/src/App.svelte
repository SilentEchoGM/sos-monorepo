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

  onMount(() => {
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

<script lang="ts">
  import { SOS, sosEvents } from "sos-plugin-types";
  import { getLogger } from "../../logger";
  import {
    EmulatorState,
    GameState,
    PlaybackState,
    state,
    UIState,
  } from "../../state";
  import { socket } from "../../socket";
  import { onMount } from "svelte";
  import WssError from "../errors/Wss.svelte";
  import { sendPacket } from "../../sendPacket";
  import { pipe } from "fp-ts/lib/function";
  import { array as A, ord as Ord, string as S } from "fp-ts";
  import type { MappedTypeDescription } from "@syncedstore/core/types/doc";
  const log = getLogger({
    filepath: "emulator-svelte/src/components/modes/Manual.svelte",
  });

  $: $state.players, sendPacket("game:update_state");

  const sortPacketEventsAlphabetically = (events: SOS.Event[]) =>
    pipe(events, A.sort(S.Ord));

  const sortPacketEventsByWeight =
    (
      state: MappedTypeDescription<{
        emulator: EmulatorState;
        game: GameState;
        players: SOS.PlayersStore;
        ui: UIState;
        playback: PlaybackState;
      }>
    ) =>
    (events: SOS.Event[]) =>
      pipe(
        events,
        A.sort(
          Ord.fromCompare((a: SOS.Event, b: SOS.Event) =>
            state.ui.packetWeights[a] < state.ui.packetWeights[b]
              ? -1
              : state.ui.packetWeights[a] > state.ui.packetWeights[b]
              ? 1
              : 0
          )
        ),
        A.reverse
      );
  onMount(() => {
    $socket = {
      channel: "open-wss",
      data: null,
    };
  });

  let sortAlphabetically = false;
</script>

<WssError />
<div class="header">
  <button on:click={() => (sortAlphabetically = !sortAlphabetically)}
    >{sortAlphabetically ? "🔤" : "📈"}</button>
  <h3>Send a Packet:</h3>
</div>

<div class="container">
  {#each sortAlphabetically ? sortPacketEventsAlphabetically( [...sosEvents] ) : sortPacketEventsByWeight($state)( [...sosEvents] ) as event}
    <button
      on:click={() => {
        $state.ui.packetWeights[event] *= 1.005;
        sendPacket(event);
      }}>{event}</button>
  {/each}
</div>

<style>
  .header {
    margin-top: 2em;
  }
  h3 {
    padding: 0;
    margin: 0;
    padding-top: 1em;
    display: inline;
  }
  .container {
    padding-top: 1em;
  }
</style>

<script lang="ts">
  import { trivial } from "fp-ts/lib/Ord";

  import { sosEvents } from "sos-plugin-types";
  import { getLogger } from "../../logger";
  import { packetFactory } from "../../packetFactory";
  import type { PacketFactory } from "../../types";
  import { record as R } from "fp-ts";
  import { pipe } from "fp-ts/function";
  import { state } from "../../state";
  import { socket } from "../../socket";
  import { onDestroy, onMount } from "svelte";
  import WssError from "../errors/Wss.svelte";

  onMount(() => {
    $socket = {
      channel: "open-wss",
      data: null,
    };
  });

  const log = getLogger({
    filepath: "emulator-svelte/src/components/modes/Manual.svelte",
  });

  export const sendEvent = (type: keyof PacketFactory) => {
    log.info("sendEvent", type);

    const fn = packetFactory[type];

    const ids = R.keys($state.players);
    const scorer = $state.players[ids[Math.floor(Math.random() * ids.length)]];

    const assister = pipe(
      $state.players,
      R.filter(
        (player) => player.id !== scorer.id && player.team === scorer.team
      ),
      R.collect(trivial)((_, player) => player)
    )[Math.floor(Math.random() * 2)];

    const data = {
      ...$state.game,
      players: $state.players,
      scorer: type === "game:goal_scored" ? scorer : null,
      assister:
        type === "game:goal_scored" && Math.random() < 0.5 ? assister : null,
      mainTarget: type === "game:statfeed_event" ? scorer : null,
    };

    log.info("Packet data:", {
      data,
      raw: {
        scorer,
        assister,
      },
    });
    const packet = fn(data);
    $socket = { channel: "send-packet", data: packet };
  };
</script>

<WssError />
<h3>Send a Packet:</h3>

<div class="container">
  {#each sosEvents as event}
    <button on:click={() => sendEvent(event)}>{event}</button>
  {/each}
</div>

<style>
  h3 {
    padding: 0;
    margin: 0;
    padding-top: 1em;
  }
  .container {
    padding-top: 1em;
  }
</style>

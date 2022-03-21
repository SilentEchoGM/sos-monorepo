<script lang="ts">
  import { sosEvents } from "sos-plugin-types";
  import { getLogger } from "../../logger";
  import { state } from "../../state";
  import { socket } from "../../socket";
  import { onMount } from "svelte";
  import WssError from "../errors/Wss.svelte";
  import { sendPacket } from "../../sendPacket";

  const log = getLogger({
    filepath: "emulator-svelte/src/components/modes/Manual.svelte",
  });

  $: $state.players, sendPacket("game:update_state");

  onMount(() => {
    $socket = {
      channel: "open-wss",
      data: null,
    };
  });
</script>

<WssError />
<h3>Send a Packet:</h3>

<div class="container">
  {#each sosEvents as event}
    <button on:click={() => sendPacket(event)}>{event}</button>
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

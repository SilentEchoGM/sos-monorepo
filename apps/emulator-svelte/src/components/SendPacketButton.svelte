<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { PacketFactory } from "../types";

  export let type: keyof PacketFactory = "game:update_state";

  const dispatch = createEventDispatcher();
</script>

<button
  on:click={() => {
    dispatch("sendEvent", type);
  }}>
  {type}
</button>

<style>
  button {
    margin-bottom: 5px;
  }

  button:last-child {
    margin-bottom: 0;
  }
</style>

<script lang="ts">
  import { socket } from "../../socket";
  import { state } from "../../state";
</script>

{#if $state.ui.wssError}
  <div class="error grid">
    <span>Unable to start the emulator's websocket server.</span>
    <button
      on:click={() => {
        $socket = {
          channel: "open-wss",
          data: null,
        };
      }}>Retry</button>
  </div>
{/if}

<style>
  .error {
    grid-template-columns: 30em 10em;
    align-items: baseline;
    background-color: var(--maroon);
    border-radius: 0.4em;
    margin-top: 1em;
    padding: 1em;
  }
</style>

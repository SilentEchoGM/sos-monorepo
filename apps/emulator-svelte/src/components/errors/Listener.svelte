<script lang="ts">
  import { state } from "../../state";
</script>

{#if $state.ui.recordingListenerError}
  <div class="error grid">
    <span>Unable to connect to the websocket server.</span>
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

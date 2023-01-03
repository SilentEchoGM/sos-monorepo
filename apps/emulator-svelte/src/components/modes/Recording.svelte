<script lang="ts">
  import { onMount } from "svelte";

  import { socket } from "../../socket";
  import { state } from "../../state";
  import ListenerError from "../errors/Listener.svelte";

  $: if ($socket.channel === "recording-started")
    $state.emulator.recording = true;
  $: if ($socket.channel === "recording-stopped")
    $state.emulator.recording = false;

  onMount(() => {
    socket.set({
      channel: "close-wss",
      data: null,
    });
  });
</script>

<ListenerError />

<div class="grid">
  {#if $state.emulator.recording}
    <button
      on:click={() => {
        socket.set({
          channel: "stop-recording",
          data: null,
        });
      }}>Stop Recording</button>
  {:else}
    <button
      style:background-color={$state.ui.recordingListenerError
        ? "var(--maroon)"
        : ""}
      on:click={() => {
        socket.set({
          channel: "start-recording",
          data: null,
        });
      }}
      >{$state.ui.recordingListenerError ? "Retry" : "Start Recording"}</button>
  {/if}
</div>

<style>
  .grid {
    padding-top: 1em;
    grid-template-columns: 15em;
  }
</style>

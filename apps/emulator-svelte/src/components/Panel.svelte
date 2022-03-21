<script lang="ts">
  export let header: string = "";
</script>

<div class="panel">
  {#if header}
    <h2>{header}</h2>
  {/if}
  <slot>...</slot>
</div>

<style>
  h2 {
    position: relative;
    color: #a07a5d;
    font-weight: 600;
    margin: 0;
    padding: 0;
    left: -0.5em;
  }
</style>

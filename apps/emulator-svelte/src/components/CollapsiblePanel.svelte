<script lang="ts">
  import { state, UIState } from "../state";

  export let header: string = "";
  export let width = "";
  export let height = "";
  export let uiKey: keyof UIState;
</script>

<div class="collapsible panel" style:width style:height>
  <div
    class="collapsible-header"
    on:click={() => ($state.ui[uiKey] = !$state.ui[uiKey])}>
    <h2>
      {header}
    </h2>
    <button><div class:rotated={$state.ui[uiKey]}>◀</div></button>
  </div>
  {#if $state.ui[uiKey]}
    <slot />
  {/if}
</div>

<style>
  h2 {
    width: 100%;
  }
  button {
    width: 45px;
    height: 45px;
    padding: 0;
    margin: 0;
    text-align: center;
    vertical-align: middle;
    padding-right: 5px;
  }
  button > div {
    transition: transform 0.5s;
    transform-origin: 55% 55%;
  }
  .rotated {
    transform: rotate(-90deg);
  }
  .collapsible-header {
    display: grid;
    align-items: baseline;
    grid-template-columns: auto 3.2em;
    gap: 1em;
    /* background-color: var(--purple); */
    /* background-color: blue; */
    left: -1em;
    padding: 0.5em;
    cursor: pointer;
  }
</style>

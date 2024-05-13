<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { Color } from "../color";

  export let label: string = "default";
  export let value: string;
  export let color: Color = Color.neutral;
  export let code = false;
  export let options: string[] = [];
  export let nullable = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (!value) value = options?.[0] ?? "test";
  });

  let expanded = false;
  let selectEl: HTMLDivElement;
  const clickHandler = (event) => {
    if (!(event.target instanceof Element)) return;

    if (event.target.id !== "click-target") {
      expanded = false;
      document.removeEventListener("click", clickHandler);

      return;
    }
  };

  let previous = value;

  $: if (value !== previous) {
    previous = value;
    dispatch("change", value);
  }
</script>

<label style:font-family={code ? "OpenDyslexicMono" : ""} for={label}
  >{label}</label>
<div class="select-container">
  <div
    on:click={(ev) => {
      ev.stopImmediatePropagation();
      expanded = !expanded;

      if (expanded) {
        document.addEventListener("click", clickHandler);
      } else {
        document.removeEventListener("click", clickHandler);
      }
    }}
    bind:this={selectEl}
    class="select"
    class:neutral={color === Color.neutral}
    class:blue={color === Color.blue}
    class:orange={color === Color.orange}>
    {value}
  </div>
  {#if expanded}
    <div class="dropdown" id="click-target" style:width={selectEl.offsetWidth}>
      {#if nullable}
        <span
          class="option"
          on:click={() => {
            value = "";
            expanded = false;
            document.removeEventListener("click", clickHandler);
          }}>None</span>
      {/if}
      {#each options as option}
        <span
          class="option"
          style:width={selectEl.offsetWidth}
          on:click={() => {
            value = option;
            expanded = false;
            document.removeEventListener("click", clickHandler);
          }}>
          {option}
        </span>
      {/each}
    </div>
  {/if}
</div>

<style>
  label {
    min-width: 5em;
    text-align: right;
  }
  .dropdown,
  .select {
    border-radius: 0.4em;
    background-color: var(--neutral);
    color: #000000;
    vertical-align: baseline;
    cursor: default;
  }
  .option {
    padding-left: 1em;
    padding-right: 1em;
  }
  .option:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .dropdown {
    position: absolute;
    margin-top: 0.4em;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }
  .select {
    padding-top: 0.1em;
    height: 2.1rem;
    font-weight: bold;
    padding-left: 1em;
  }
  .neutral {
    background-color: var(--neutral);
  }
  .blue {
    background-color: var(--blue);
  }
  .orange {
    background-color: var(--orange);
  }
</style>

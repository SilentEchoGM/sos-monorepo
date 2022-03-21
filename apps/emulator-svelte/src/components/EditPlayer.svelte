<script lang="ts">
  import type { SOS } from "sos-plugin-types";
  import { state } from "../state";
  import { Color } from "./color";
  import BooleanInput from "./inputs/BooleanInput.svelte";
  import NumberInput from "./inputs/NumberInput.svelte";
  import TextInput from "./inputs/TextInput.svelte";

  export let player: SOS.Player["id"];
  export let stopEditing: () => void;

  let color = $state.players[player].team ? Color.orange : Color.blue;
</script>

<div
  class="panel"
  style:border-color={color === Color.orange ? "var(--orange)" : "var(--blue)"}>
  <div class="grid text">
    <TextInput
      label="name"
      code
      {color}
      bind:value={$state.players[player].name} />
    <TextInput
      label="attacker"
      code
      {color}
      bind:value={$state.players[player].attacker} />
    <TextInput label="id" code {color} bind:value={$state.players[player].id} />
    <TextInput
      label="primaryID"
      code
      {color}
      bind:value={$state.players[player].primaryID} />
  </div>
  <div class="grid triple">
    <button class="done" on:click={stopEditing}>✔</button>

    <NumberInput
      label={"assists"}
      code
      {color}
      bind:value={$state.players[player].assists} />
    <NumberInput
      label={"boost"}
      code
      {color}
      bind:value={$state.players[player].boost} />
    <NumberInput
      label={"cartouches"}
      code
      {color}
      bind:value={$state.players[player].cartouches} />
    <NumberInput
      label={"demos"}
      code
      {color}
      bind:value={$state.players[player].demos} />
    <NumberInput
      label={"goals"}
      code
      {color}
      bind:value={$state.players[player].goals} />
    <NumberInput
      label={"saves"}
      code
      {color}
      bind:value={$state.players[player].saves} />
    <NumberInput
      label={"score"}
      code
      {color}
      bind:value={$state.players[player].score} />
    <NumberInput
      label={"shots"}
      code
      {color}
      bind:value={$state.players[player].shots} />
    <NumberInput
      label={"speed"}
      code
      {color}
      bind:value={$state.players[player].speed} />
    <NumberInput
      label={"team"}
      code
      {color}
      bind:value={$state.players[player].team} />
    <NumberInput
      label={"touches"}
      code
      {color}
      bind:value={$state.players[player].touches} />
    <NumberInput
      label={"shortcut"}
      code
      {color}
      bind:value={$state.players[player].shortcut} />
  </div>
  <div class="grid double">
    <BooleanInput
      bind:checked={$state.players[player].isPowersliding}
      label={"isPowersliding"}
      {color}
      code />
    <BooleanInput
      bind:checked={$state.players[player].isSonic}
      label={"isSonic"}
      {color}
      code />
    <BooleanInput
      bind:checked={$state.players[player].onGround}
      label={"onGround"}
      {color}
      code />
    <BooleanInput
      bind:checked={$state.players[player].onWall}
      label={"onWall"}
      {color}
      code />
    <BooleanInput
      bind:checked={$state.players[player].hasCar}
      label={"hasCar"}
      {color}
      code />
    <BooleanInput
      bind:checked={$state.players[player].isDead}
      label={"isDead"}
      {color}
      code />
  </div>
</div>

<style>
  .panel {
    position: fixed;
    width: calc(100% - 30vw);
    height: calc(100% - 30vh);
    left: calc((100% - 70vw) / 2);
    top: calc((100% - 70vh) / 2);
    overflow-y: scroll;
    z-index: 100;
    border: solid 0.3em;
    padding: 1em;
    margin: 0;
  }
  .double {
    grid-template-columns: 10em 5em 10em 5em;
    margin-top: 1em;
  }
  .triple {
    grid-template-columns: 1fr 5em 1fr 5em 1fr 5em;
    margin-top: 1em;
  }

  .text {
    grid-template-columns: 10em 20em;
  }
  .done {
    position: absolute;
    right: 2em;
    top: 2em;
    width: 4em;
    height: 4em;
  }
</style>

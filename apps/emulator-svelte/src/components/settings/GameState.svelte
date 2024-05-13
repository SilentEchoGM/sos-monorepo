<script lang="ts">
  import { state } from "../../state";

  import CollapsiblePanel from "../CollapsiblePanel.svelte";
  import { Color } from "../color";
  import BooleanInput from "../inputs/BooleanInput.svelte";
  import NumberInput from "../inputs/NumberInput.svelte";
  import TextInput from "../inputs/TextInput.svelte";
  import { v4 } from "uuid";
  import { sosStatFeedEvents } from "sos-plugin-types";
  import SelectInput from "../inputs/SelectInput.svelte";
</script>

<CollapsiblePanel header="Game State" uiKey="gameStateOpen">
  <div class="grid">
    <div class="row" id="line1">
      <TextInput
        bind:value={$state.game.match_guid}
        label={"match_guid"}
        code />
      <button on:click={() => ($state.game.match_guid = v4())}
        >New Game ID</button>
    </div>
    <div class="row" id="line2">
      <TextInput
        bind:value={$state.game.blueName}
        label={"blueName"}
        code
        color={Color.blue} />
      <TextInput
        bind:value={$state.game.orangeName}
        label={"orangeName"}
        code
        color={Color.orange} />
    </div>
    <div class="row" id="line3">
      <NumberInput
        bind:value={$state.game.blueScore}
        label={"blueScore"}
        code
        color={Color.blue} />
      <NumberInput
        bind:value={$state.game.orangeScore}
        label={"orangeScore"}
        code
        color={Color.orange} />
    </div>
    <div class="row" id="line4">
      <NumberInput bind:value={$state.game.time} label={"time"} code />
      <button on:click={() => ($state.game.ticking = !$state.game.ticking)}
        >{$state.game.ticking ? "Stop" : "Start"}</button>
      <button
        on:click={() => {
          $state.game.time = 300;
          $state.game.ticking = false;
        }}>Reset</button>
      <BooleanInput bind:checked={$state.game.isOT} label={"isOT"} code />
      <BooleanInput
        bind:checked={$state.game.isReplay}
        label={"isReplay"}
        code />
    </div>
    <div id="line5" class="row">
      <SelectInput
        bind:value={$state.game.target}
        label={"target"}
        code
        nullable
        options={[...Object.keys($state.players)]} />
      <SelectInput
        bind:value={$state.game.statType}
        label="statType"
        options={[...sosStatFeedEvents].sort()}
        code />
    </div>
  </div>
</CollapsiblePanel>

<style>
  .row {
    display: grid;
    gap: 1em;
    width: 100%;
  }

  #line1 {
    grid-template-columns: 10em 26em 10em;
  }
  #line2,
  #line3,
  #line5 {
    grid-template-columns: 10em 15em 10em 15em;
  }
  #line4 {
    grid-template-columns: 10em 4.5em 4em 4.5em 10em 2em 9em 2em;
  }
</style>

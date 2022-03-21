<script>
  import { getLogger } from "../logger";
  import {
    gameId,
    matchBoolSettings,
    matchSettings,
    players,
    stat,
    target,
    wssOpen,
  } from "../stores";
  import Toggle from "./Toggle.svelte";
  import { v4 } from "uuid";
  import { getPlayerStore } from "../packetFactory/utils/getPlayerStore";
  import { sosStatFeedEvents } from "sos-plugin-types";

  const log = getLogger({
    filepath: "svelte/src/lib/frontend/components/Settings.svelte",
  });

  $: log.info("matchSettings", {
    settings: $matchSettings,
    bools: $matchBoolSettings,
  });

  const numberProps = [
    "team",
    "assists",
    "boost",
    "demos",
    "goals",
    "saves",
    "score",
    "shortcut",
    "shots",
    "speed",
    "touches",
    "cartouches",
  ];
</script>

<div class="settings-container column-content">
  <button
    on:click={() => {
      $gameId = v4();
    }}>New Game Id</button>

  <button
    on:click={() => {
      matchSettings.set({
        arena: "Stadium_P",
        blueName: "BLUE",
        orangeName: "ORANGE",
        blueScore: 0,
        orangeScore: 0,
        time: 300,
      });

      matchBoolSettings.set({
        isOT: false,
        isReplay: false,
      });

      target.set("none");
      players.set(getPlayerStore());
    }}>Reset all values</button>

  <span>Enable Websocket Server:</span><Toggle bind:checked={$wssOpen} />

  {#each Object.keys($matchSettings) as setting}
    <span>{setting}</span>
    <div class="input-container">
      <div class="input-accent">
        <input type="text" bind:value={$matchSettings[setting]} />
      </div>
    </div>
  {/each}

  {#each Object.keys($matchBoolSettings) as bool}
    <span>{bool}</span>
    <Toggle bind:checked={$matchBoolSettings[bool]} />
  {/each}

  <span>target</span>
  <select class="input-accent" name="target" id="" bind:value={$target}>
    <option value="none">none</option>
    {#each Object.keys($players) as player}
      <option value={player}>{player}</option>
    {/each}
  </select>

  <span>Stat Event</span>
  <select class="input-accent" name="stat" id="" bind:value={$stat}>
    {#each sosStatFeedEvents as stat}
      <option value={stat}>{stat}</option>
    {/each}
  </select>

  {#each Object.keys($players) as id}
    <h6>{$players[id].name}</h6>
    <div />
    {#each Object.keys($players[id]) as prop}
      {#if $players[id][prop].toString() !== "[object Object]"}
        <span>{prop}</span>
        <div class="input-container">
          <div class="input-accent">
            {#if numberProps.includes(prop)}
              <input bind:value={$players[id][prop]} min="0" type="number" />
            {:else}
              <input bind:value={$players[id][prop]} />
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  {/each}
</div>

<style>
  .settings-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    row-gap: 5px;
    align-items: baseline;
  }

  span {
    text-align: center;
    font-family: monospace;
  }

  button {
    grid-column: 1 / span 2;
  }
</style>

import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { SOS } from "sos-plugin-types";
import { getPlayerStore } from "./packetFactory/utils/getPlayerStore";
import localForage from "localforage";
import { v4 } from "uuid";

// const prettyMapNames = {
//   "Stadium_P":
// }

export const createPersistentStore = (defaultValue: any, name: string) => {
  const { set, subscribe, update } = writable(defaultValue);

  const save = (value: any) => {
    localForage.setItem(name, value);
    set(value);
  };

  return {
    set: save,
    subscribe,
    update,
  };
};

export const defaultMatchSettings = {
  arena: "Stadium_P",
  blueName: "BLUE",
  orangeName: "ORANGE",
  blueScore: 0,
  orangeScore: 0,
  time: 300,
};

export const matchSettings = createPersistentStore(
  {
    arena: "Stadium_P",
    blueName: "BLUE",
    orangeName: "ORANGE",
    blueScore: 0,
    orangeScore: 0,
    time: 300,
  },
  "settings"
);

export const target = createPersistentStore("none", "target");
export const stat = createPersistentStore("Shot on Goal", "stat");

export const matchBoolSettings = createPersistentStore(
  {
    isOT: false,
    isReplay: false,
  },
  "bools"
);

export const players: Writable<SOS.PlayersStore> = createPersistentStore(
  getPlayerStore(),
  "players"
);

export const gameId = createPersistentStore(v4(), "gameId");

export const wssOpen = writable(false);
export const recording = writable(false);
export const playback = writable(false);
export const playbackGameId = writable("");

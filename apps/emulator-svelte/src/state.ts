import { DatedPacket, SOS, sosEvents } from "sos-plugin-types";

import { function as f, readonlyArray as RA } from "fp-ts";
import { Persistent, persistent } from "./persistentStore";

export type GameState = {
  match_guid: string;
  blueName: string;
  blueScore: number;
  orangeName: string;
  orangeScore: number;
  time: number;
  arena: string;
  target: string;
  statEvent: string;
  isOT: boolean;
  isReplay: boolean;
  statType: SOS.StatFeedEvent;
  ticking: boolean;
  lastTick: number;
};

const defaultGameState: GameState = {
  match_guid: "",
  blueName: "",
  blueScore: 0,
  orangeName: "",
  orangeScore: 0,
  time: 0,
  arena: "",
  target: "",
  statEvent: "",
  isOT: false,
  isReplay: false,
  statType: "Shot on Goal",
  ticking: false,
  lastTick: Date.now(),
};

export type UIState = {
  gameStateOpen: boolean;
  playersOpen: boolean;
  emulatorModeOpen: boolean;
  wssError: boolean;
  recordingListenerError: boolean;
  packetWeights: Record<SOS.Event, number>;
};

export enum EmulatorMode {
  manual,
  recording,
  playback,
}

export type EmulatorState = {
  mode: EmulatorMode;
  recording: boolean;
  playing: boolean;
  recentPackets: Record<SOS.Event, DatedPacket<SOS.Packet>[]>;
};

export type PlaybackState = {
  currentFrame: number;
  length: number;
  gameId: string | null;
  listOfGameIds: string[];
  loaded: boolean;
  statPackets: DatedPacket<SOS.GameStatFeedEvent>[];
};

export type AppState = {
  emulator: EmulatorState;
  game: GameState;
  players: SOS.PlayersStore;
  ui: UIState;
  playback: PlaybackState;
};

export const state: Persistent<AppState> = persistent<AppState>("AppState", {
  emulator: {
    mode: EmulatorMode.manual,
    recording: false,
    playing: false,
    recentPackets: f.pipe(
      sosEvents,
      RA.reduce(
        {} as Record<SOS.Event, DatedPacket<SOS.Packet>[]>,
        (acc, event) => ({ ...acc, [event]: [] })
      )
    ),
  },
  game: defaultGameState,
  players: {},
  ui: {
    gameStateOpen: true,
    playersOpen: true,
    emulatorModeOpen: true,
    wssError: false,
    recordingListenerError: false,
    packetWeights: f.pipe(
      sosEvents,
      RA.reduce({} as Record<SOS.Event, number>, (acc, event) => ({
        ...acc,
        [event]: 0,
      }))
    ),
  },
  playback: {
    currentFrame: 0,
    length: 0,
    gameId: null,
    listOfGameIds: [],
    loaded: false,
    statPackets: [],
  },
});

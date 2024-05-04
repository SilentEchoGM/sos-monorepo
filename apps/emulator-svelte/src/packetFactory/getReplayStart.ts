import { gameId } from "../stores";
import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import { getMisc } from "./getMisc";
import type { Options } from "../types";

export const getReplayStartPlain = () =>
  ({
    data: "game_replay_start",
    event: "game:replay_start",
  } as SOS.GameReplayStart);

export const getReplayStartData = ({ match_guid = get(gameId) }: Options) =>
  getMisc("game:replay_start")({ match_guid }) as SOS.GameMisc;

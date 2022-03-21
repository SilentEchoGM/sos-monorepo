import { gameId } from "../stores";
import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import type { Options } from "../types";

export const getMatchEnded = ({
  match_guid = get(gameId),
  winner_team_num = 0,
}: Options) =>
  ({
    event: "game:match_ended",
    data: {
      match_guid,
      winner_team_num,
    },
  } as SOS.GameMatchEnded);

import { gameId } from "../stores";
import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import { getLocation } from "./utils/getLocation";
import { getPlayer } from "./utils/getPlayer";
import type { Options } from "../types";

export const getBallHit = ({
  match_guid = get(gameId),
  player = getPlayer(),
}: Options) =>
  ({
    data: {
      ball: {
        location: getLocation(),
        post_hit_speed: 10,
        pre_hit_speed: 1,
      },
      match_guid,
      player,
    },
    event: "game:ball_hit",
  } as SOS.GameBallHit);

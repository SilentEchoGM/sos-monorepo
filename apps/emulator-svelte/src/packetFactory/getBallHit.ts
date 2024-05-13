import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import { gameId } from "../stores";
import type { Options } from "../types";
import { getLocation } from "./utils/getLocation";
import { getPlayer } from "./utils/getPlayer";

export const getBallHit = ({
  match_guid = get(gameId),
  player = getPlayer(),
}: Options): SOS.GameBallHit => ({
  data: {
    ball: {
      location: getLocation(),
      post_hit_speed: 10,
      pre_hit_speed: 1,
    },
    match_guid,
    player: {
      id: player.id,
      name: player.name,
    },
  },
  event: "game:ball_hit",
});

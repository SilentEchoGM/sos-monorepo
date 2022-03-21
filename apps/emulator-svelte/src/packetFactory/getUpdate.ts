import { gameId } from "../stores";
import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import { getLocation } from "./utils/getLocation";
import { getPlayerStore } from "./utils/getPlayerStore";
import type { Options } from "../types";

export const getUpdate = ({
  players = getPlayerStore(),
  arena = "Stadium_P",
  isOT = false,
  isReplay = false,
  target = "",
  blueName = "BLUE",
  orangeName = "ORANGE",
  blueScore = 0,
  orangeScore = 0,
  time = 300,
  match_guid = get(gameId),
}: Options): SOS.Packet => ({
  event: "game:update_state",
  data: {
    event: "gamestate",
    game: {
      arena,
      ball: {
        location: getLocation(),
        speed: 0,
        team: 255,
      },
      hasTarget: target === "none" || target === "" ? false : true,
      hasWinner: false,
      isOT,
      isReplay,
      target,
      teams: [
        {
          color_primary: "1873FF",
          color_secondary: "E5E5E5",
          name: blueName,
          score: blueScore,
        },
        {
          color_primary: "C26418",
          color_secondary: "E5E5E5",
          name: orangeName,
          score: orangeScore,
        },
      ],
      time_milliseconds: time,
      time_seconds: time,
      winner: "",
    },
    hasGame: true,
    match_guid,
    players,
  },
});

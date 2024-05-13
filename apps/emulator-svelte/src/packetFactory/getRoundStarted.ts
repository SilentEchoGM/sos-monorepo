import type { SOS } from "sos-plugin-types";

export const getRoundStarted = () =>
  ({
    data: "game_round_started_go",
    event: "game:round_started_go",
  } as SOS.GameRoundStarted);

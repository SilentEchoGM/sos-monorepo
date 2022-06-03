import type { SOS } from "sos-plugin-types";
import type { Options } from "../types";
import { getPlayer } from "./utils/getPlayer";
import { getTarget } from "./utils/getTarget";

export const getGoalScored = ({
  scorer = getPlayer(),
  assister = null,
  ball_last_touch = { player: "", speed: 1 },
  goalspeed = 222,
  goaltime = 299,
  impact_location = {
    X: 0.5,
    Y: 0.5,
  },
}: Options) =>
  ({
    event: "game:goal_scored",
    data: {
      assister: {
        id: assister?.id ?? "",
        name: assister?.name ?? "",
      },
      ball_last_touch,
      goalspeed,
      goaltime,
      impact_location,
      scorer: getTarget(scorer),
    },
  } as SOS.GameGoalScored);

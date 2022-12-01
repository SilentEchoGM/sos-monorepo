import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import { gameId } from "../stores";
import type { Options } from "../types";
import { getPlayer } from "./utils/getPlayer";
import { getTarget } from "./utils/getTarget";

export const getStatFeedEvent = ({
  statType = "Shot on Goal",
  mainTarget = getPlayer(),
  secondaryTarget = null,
  match_guid = get(gameId),
}: Options) =>
  ({
    data: {
      main_target: getTarget(mainTarget),
      secondary_target: getTarget(secondaryTarget) ?? {
        id: "",
        name: "",
        team_num: -1,
      },
      match_guid,
      type: statType,
    },
    event: "game:statfeed_event",
  } as SOS.GameStatFeedEvent);

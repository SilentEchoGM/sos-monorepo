import type { SOS } from "sos-plugin-types";
import type { DemoOptions, Options, PacketFactory } from "../types";
import { getBallHit } from "./getBallHit";
import { getGoalScored } from "./getGoalScored";
import { getMatchEnded } from "./getMatchEnded";
import { getMisc } from "./getMisc";
import { getReplayStartData, getReplayStartPlain } from "./getReplayStart";
import { getRoundStarted } from "./getRoundStarted";
import { getStatFeedEvent } from "./getStatFeedEvent";
import { getUpdate } from "./getUpdate";

export const packetFactory: PacketFactory = {
  "game:update_state": getUpdate,
  "game:match_created": getMisc("game:match_created"),
  "game:clock_updated_seconds": getMisc("game:clock_updated_seconds"),
  "game:initialized": getMisc("game:initialized"),
  "game:pre_countdown_begin": getMisc("game:pre_countdown_begin"),
  "game:post_countdown_begin": getMisc("game:post_countdown_begin"),
  "game:clock_started": getMisc("game:clock_started"),
  "game:clock_stopped": getMisc("game:clock_stopped"),
  "game:replay_end": getMisc("game:replay_end"),
  "game:replay_will_end": getMisc("game:replay_will_end"),
  "game:podium_start": getMisc("game:podium_start"),
  "game:match_destroyed": getMisc("game:match_destroyed"),
  "game:round_started_go": getRoundStarted,
  "game:ball_hit": getBallHit,
  "game:statfeed_event": getStatFeedEvent,
  "game:goal_scored": getGoalScored,
  "game:replay_start": getReplayStartPlain,
  "game:replay_start||data": getReplayStartData,
  "game:statfeed_event||demo": (options: DemoOptions) =>
    getStatFeedEvent({
      ...options,
      statType: "Demolition",
    }),
  "game:match_ended": getMatchEnded,
  "sos:version": () =>
    ({
      event: "sos:version",
      data: "SOS_Emulator",
    } as SOS.SOSVersion),
};

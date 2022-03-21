import { pipe } from "fp-ts/function";
import { record as R } from "fp-ts";
import { get } from "svelte/store";
import { getLogger } from "./logger";
import { packetFactory } from "./packetFactory";
import { state } from "./state";
import type { PacketFactory } from "./types";
import { trivial } from "fp-ts/lib/Ord";
import { socket } from "./socket";

const log = getLogger({
  filepath: "apps/emulator-svelte/src/components/PacketSender.svelte",
});

export const sendPacket = (type: keyof PacketFactory) => {
  log.info("sendEvent", type);
  const $state = get(state);
  const fn = packetFactory[type];

  const ids = R.keys($state.players);
  const scorer = $state.players[ids[Math.floor(Math.random() * ids.length)]];

  const assister = pipe(
    $state.players,
    R.filter(
      (player) => player.id !== scorer.id && player.team === scorer.team
    ),
    R.collect(trivial)((_, player) => player)
  )[Math.floor(Math.random() * 2)];

  const data = {
    ...$state.game,
    players: $state.players,
    scorer: type === "game:goal_scored" ? scorer : null,
    assister:
      type === "game:goal_scored" && Math.random() < 0.5 ? assister : null,
    mainTarget: type === "game:statfeed_event" ? scorer : null,
  };

  log.info("Packet data:", {
    data,
    raw: {
      scorer,
      assister,
    },
  });
  const packet = fn(data);
  socket.set({ channel: "send-packet", data: packet });
};

import type { SOS } from "sos-plugin-types";
import { record as R, array as A, ord as Ord } from "fp-ts";
import { pipe } from "fp-ts/function";
import { getLocationAndRotation } from "./getLocationAndRotation";
import { getPlatformId } from "./getPlatformId";

export const getPlayer = (
  name: string = "Darman",
  team: 0 | 1 = 0,
  existingPlayers: Record<`${string}_${number}`, SOS.Player> = {}
): SOS.Player => {
  const existingIds = pipe(
    existingPlayers,
    R.map(({ id }) => id),
    R.collect(Ord.trivial)((_, a) => a),
    A.map((id) => parseInt(id.slice(-1)))
  );

  let newId = team ? 4 : 0;
  while (existingIds.includes(newId)) {
    newId++;
  }

  return {
    assists: 0,
    attacker: "",
    boost: Math.floor(Math.random() * 101),
    cartouches: 0,
    demos: 0,
    goals: 0,
    hasCar: true,
    id: `${name}_${newId}`,
    isDead: false,
    isPowersliding: false,
    isSonic: false,
    location: getLocationAndRotation(),
    name,
    onGround: false,
    onWall: false,
    primaryID: getPlatformId(),
    saves: 0,
    score: 0,
    shortcut: newId,
    shots: 0,
    speed: 0,
    team,
    touches: 0,
  };
};

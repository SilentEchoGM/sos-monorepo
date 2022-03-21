import type { SOS } from "sos-plugin-types";
import { pipe } from "fp-ts/function";
import { array as A } from "fp-ts";
import { keys } from "fp-ts/Record";
import { getPlayer } from "./getPlayer";

const names = ["Darman", "Niner", "Fi", "Atin", "Etain", "Bardan", "Kal"];

export const getPlayerStore = (players: SOS.PlayersStore = {}) => {
  const neededCount = 6 - keys(players).length;
  return pipe(
    new Array(neededCount),
    A.reduceWithIndex(players, (i, acc, _) => {
      const name = names[neededCount - i];
      const team = i % 2;

      if (!(team === 1 || team === 0)) throw new Error("Invalid team value");

      const player = getPlayer(name, team, acc);
      return {
        ...acc,
        [player.id]: player,
      };
    })
  ) as SOS.PlayersStore;
};

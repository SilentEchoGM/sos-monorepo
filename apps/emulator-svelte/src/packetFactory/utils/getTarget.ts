import type { SOS } from "sos-plugin-types";
import { getPlayer } from "./getPlayer";

export const getTarget = (
  { id, name, team }: SOS.Player = {
    ...getPlayer(),
  }
) => ({
  id,
  name,
  team_num: team,
});

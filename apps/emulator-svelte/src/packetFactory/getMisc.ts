import { gameId } from "../stores";
import type { SOS } from "sos-plugin-types";
import { get } from "svelte/store";
import type { Options } from "../types";

export const getMisc =
  (event: SOS.Event) =>
  ({ match_guid = get(gameId) }: Options) =>
    ({
      data: {
        match_guid,
      },
      event,
    } as SOS.GameMisc);

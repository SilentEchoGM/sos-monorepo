import type { SOS } from "sos-plugin-types";

export type BasicPlayer = {
  name: string;
  team: 1 | 0;
  id: number;
};

export type Options = {
  statType?: SOS.StatFeedEvent;
  mainTarget?: SOS.Player;
  secondaryTarget?: SOS.Player | null;
  players?: SOS.PlayersStore;
  player?: SOS.Player;
  arena?: string;
  isOT?: boolean;
  isReplay?: boolean;
  target?: string;
  blueName?: string;
  orangeName?: string;
  blueScore?: number;
  orangeScore?: number;
  time?: number;
  match_guid?: string;
  scorer?: SOS.Player;
  assister?: SOS.Player | null;
  ball_last_touch?: SOS.BallLastTouch;
  goalspeed?: number;
  goaltime?: number;
  impact_location?: SOS.ImpactLocation;
  winner_team_num?: 0 | 1;
};

type PacketFetcher = (options: Options) => SOS.Packet;

export interface PacketFactory
  extends Record<SOS.Event | "game:replay_start||data", PacketFetcher> {}

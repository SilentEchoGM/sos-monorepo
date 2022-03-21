import { ord as Ord, date as D } from "fp-ts";

export const sosEvents = [
  "game:update_state", //
  "game:initialized", //
  "game:pre_countdown_begin", //
  "game:post_countdown_begin", //
  "game:round_started_go", //
  "game:clock_started", //
  "game:ball_hit", //
  "game:clock_updated_seconds", //
  "game:statfeed_event", //
  "game:clock_stopped", //
  "game:goal_scored", //
  "game:replay_start", //
  "game:replay_end", //
  "game:replay_will_end", //
  "game:match_ended", //
  "game:podium_start", //
  "game:match_destroyed", //
  "game:match_created", //
  "sos:version",
] as const;

export const sosStatFeedEvents = [
  "Demolition",
  "Shot on Goal",
  "Goal",
  "Assist",
  "Save",
  "Epic Save",
] as const;

export const gameStates = [
  "Default",
  "Created",
  "Ready",
  "Countdown",
  "Kickoff",
  "Active",
  "GoalScored",
  "Replay",
  "Ended",
  "Podium",
  "Scoreboard",
  "Menu",
] as const;

export enum TeamEnum {
  blue,
  orange,
}

export const miscEvents = [
  "game:initialized",
  "game:pre_countdown_begin",
  "game:post_countdown_begin",
  "game:clock_started",
  "game:clock_updated_seconds",
  "game:clock_stopped",
  "game:replay_end",
  "game:replay_will_end",
  "game:podium_start",
  "game:match_destroyed",
  "game:match_created",
] as const;

export namespace SOS {
  export type Event = typeof sosEvents[number];

  export type StatFeedEvent = typeof sosStatFeedEvents[number];
  export interface Location {
    X: number;
    Y: number;
    Z: number;
  }

  export interface PlayerLocation extends Location {
    pitch: number;
    roll: number;
    yaw: number;
  }

  export interface MatchGUIDData {
    match_guid: string;
  }

  export interface GameMisc {
    data: MatchGUIDData;
    event: typeof miscEvents[number];
  }

  export interface GameMatchEnded {
    data: MatchGUIDData & { winner_team_num: 0 | 1 };
    event: "game:match_ended";
  }
  export interface GameRoundStarted {
    data: "game_round_started_go";
    event: "game:round_started_go";
  }

  export interface BasicPlayer {
    id: string;
    name: string;
  }

  export interface GameReplayStart {
    data: "game_replay_start" | MatchGUIDData;
    event: "game:replay_start";
  }
  export interface BallLastTouch {
    player: string;
    speed: number;
  }

  export interface ImpactLocation {
    X: number;
    Y: number;
  }
  export interface Target {
    id: string;
    name: string;
    team_num: TeamEnum | -1;
  }

  export interface GoalScoredData {
    assister: BasicPlayer;
    ball_last_touch: BallLastTouch;
    goalspeed: number;
    goaltime: number;
    impact_location: ImpactLocation;
    scorer: Target;
  }

  export interface GameGoalScored {
    data: GoalScoredData;
    event: "game:goal_scored";
  }

  export interface GameBallHitBallData {
    location: Location;
    post_hit_speed: number;
    pre_hit_speed: number;
  }

  export interface GameStatFeedEventData {
    main_target: Target;
    match_guid: string;
    secondary_target: Target;
    type: StatFeedEvent;
  }

  export interface GameStatFeedEvent {
    data: GameStatFeedEventData;
    event: "game:statfeed_event";
  }

  export interface GameBallHitData {
    ball: GameBallHitBallData;
    match_guid: string;
    player: BasicPlayer;
  }

  export interface GameBallHit {
    data: GameBallHitData;
    event: "game:ball_hit";
  }

  export interface Player {
    assists: number;
    attacker: string;
    boost: number;
    cartouches: number;
    demos: number;
    goals: number;
    hasCar: boolean;
    id: string;
    isDead: boolean;
    isPowersliding: boolean;
    isSonic: boolean;
    location: PlayerLocation;
    name: string;
    onGround: boolean;
    onWall: boolean;
    primaryID: string;
    saves: number;
    score: number;
    shortcut: number;
    shots: number;
    speed: number;
    team: TeamEnum;
    touches: number;
  }

  export interface IndexedPlayer extends Player {
    teamIndex: number;
  }

  export interface PlayersStore {
    [key: string]: Player;
  }

  export interface Ball {
    location: Location;
    speed: number;
    team: number;
  }

  export interface Team {
    color_primary: string;
    color_secondary: string;
    name: string;
    score: number;
  }

  export interface Game {
    arena: string;
    ball: Ball;
    hasTarget: boolean;
    hasWinner: boolean;
    isOT: boolean;
    isReplay: boolean;
    target: string;
    teams: Record<TeamEnum, Team>;
    time_milliseconds: number;
    time_seconds: number;
    winner: string;
  }

  export interface GameUpdateData {
    event: "gamestate";
    game: Game;
    hasGame: boolean;
    match_guid: string;
    players: PlayersStore;
  }

  export interface GameUpdate {
    data: GameUpdateData;
    event: "game:update_state";
  }

  export interface SOSVersion {
    data: string;
    event: "sos:version";
  }

  export type Packet =
    | GameUpdate
    | GameBallHit
    | GameStatFeedEvent
    | GameGoalScored
    | GameReplayStart
    | GameRoundStarted
    | GameMatchEnded
    | GameMisc
    | SOSVersion;

  export type GameState = typeof gameStates[number];
}

export type DatedPacket = SOS.Packet & {
  date: Date;
};

export const isPacket = (possiblePacket: any): possiblePacket is SOS.Packet => {
  if (possiblePacket)
    return "data" in possiblePacket && "event" in possiblePacket;
};

export const isDatedPacket = (
  possiblePacket: any
): possiblePacket is DatedPacket =>
  isPacket(possiblePacket) && "date" in possiblePacket;

export const ordDatedPacket: Ord.Ord<DatedPacket> = Ord.fromCompare((a, b) =>
  D.Ord.compare(a.date, b.date)
);

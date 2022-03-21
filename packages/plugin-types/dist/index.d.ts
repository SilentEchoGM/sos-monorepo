import { ord as Ord } from "fp-ts";
export declare const sosEvents: readonly ["game:update_state", "game:initialized", "game:pre_countdown_begin", "game:post_countdown_begin", "game:round_started_go", "game:clock_started", "game:ball_hit", "game:clock_updated_seconds", "game:statfeed_event", "game:clock_stopped", "game:goal_scored", "game:replay_start", "game:replay_end", "game:replay_will_end", "game:match_ended", "game:podium_start", "game:match_destroyed", "game:match_created", "sos:version"];
export declare const sosStatFeedEvents: readonly ["Demolition", "Shot on Goal", "Goal", "Assist", "Save", "Epic Save"];
export declare const gameStates: readonly ["Default", "Created", "Ready", "Countdown", "Kickoff", "Active", "GoalScored", "Replay", "Ended", "Podium", "Scoreboard", "Menu"];
export declare enum TeamEnum {
    blue = 0,
    orange = 1
}
export declare const miscEvents: readonly ["game:initialized", "game:pre_countdown_begin", "game:post_countdown_begin", "game:clock_started", "game:clock_updated_seconds", "game:clock_stopped", "game:replay_end", "game:replay_will_end", "game:podium_start", "game:match_destroyed", "game:match_created"];
export declare namespace SOS {
    type Event = typeof sosEvents[number];
    type StatFeedEvent = typeof sosStatFeedEvents[number];
    interface Location {
        X: number;
        Y: number;
        Z: number;
    }
    interface PlayerLocation extends Location {
        pitch: number;
        roll: number;
        yaw: number;
    }
    interface MatchGUIDData {
        match_guid: string;
    }
    interface GameMisc {
        data: MatchGUIDData;
        event: typeof miscEvents[number];
    }
    interface GameMatchEnded {
        data: MatchGUIDData & {
            winner_team_num: 0 | 1;
        };
        event: "game:match_ended";
    }
    interface GameRoundStarted {
        data: "game_round_started_go";
        event: "game:round_started_go";
    }
    interface BasicPlayer {
        id: string;
        name: string;
    }
    interface GameReplayStart {
        data: "game_replay_start" | MatchGUIDData;
        event: "game:replay_start";
    }
    interface BallLastTouch {
        player: string;
        speed: number;
    }
    interface ImpactLocation {
        X: number;
        Y: number;
    }
    interface Target {
        id: string;
        name: string;
        team_num: TeamEnum | -1;
    }
    interface GoalScoredData {
        assister: BasicPlayer;
        ball_last_touch: BallLastTouch;
        goalspeed: number;
        goaltime: number;
        impact_location: ImpactLocation;
        scorer: Target;
    }
    interface GameGoalScored {
        data: GoalScoredData;
        event: "game:goal_scored";
    }
    interface GameBallHitBallData {
        location: Location;
        post_hit_speed: number;
        pre_hit_speed: number;
    }
    interface GameStatFeedEventData {
        main_target: Target;
        match_guid: string;
        secondary_target: Target;
        type: StatFeedEvent;
    }
    interface GameStatFeedEvent {
        data: GameStatFeedEventData;
        event: "game:statfeed_event";
    }
    interface GameBallHitData {
        ball: GameBallHitBallData;
        match_guid: string;
        player: BasicPlayer;
    }
    interface GameBallHit {
        data: GameBallHitData;
        event: "game:ball_hit";
    }
    interface Player {
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
    interface IndexedPlayer extends Player {
        teamIndex: number;
    }
    interface PlayersStore {
        [key: string]: Player;
    }
    interface Ball {
        location: Location;
        speed: number;
        team: number;
    }
    interface Team {
        color_primary: string;
        color_secondary: string;
        name: string;
        score: number;
    }
    interface Game {
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
    interface GameUpdateData {
        event: "gamestate";
        game: Game;
        hasGame: boolean;
        match_guid: string;
        players: PlayersStore;
    }
    interface GameUpdate {
        data: GameUpdateData;
        event: "game:update_state";
    }
    interface SOSVersion {
        data: string;
        event: "sos:version";
    }
    type Packet = GameUpdate | GameBallHit | GameStatFeedEvent | GameGoalScored | GameReplayStart | GameRoundStarted | GameMatchEnded | GameMisc | SOSVersion;
    type GameState = typeof gameStates[number];
}
export declare type DatedPacket = SOS.Packet & {
    date: Date;
};
export declare const isPacket: (possiblePacket: any) => possiblePacket is SOS.Packet;
export declare const isDatedPacket: (possiblePacket: any) => possiblePacket is DatedPacket;
export declare const ordDatedPacket: Ord.Ord<DatedPacket>;
//# sourceMappingURL=index.d.ts.map
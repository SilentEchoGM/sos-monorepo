"use strict";
exports.__esModule = true;
exports.ordDatedPacket = exports.isDatedPacket = exports.isPacket = exports.miscEvents = exports.TeamEnum = exports.gameStates = exports.sosStatFeedEvents = exports.sosEvents = void 0;
var fp_ts_1 = require("fp-ts");
exports.sosEvents = [
    "game:update_state",
    "game:initialized",
    "game:pre_countdown_begin",
    "game:post_countdown_begin",
    "game:round_started_go",
    "game:clock_started",
    "game:ball_hit",
    "game:clock_updated_seconds",
    "game:statfeed_event",
    "game:clock_stopped",
    "game:goal_scored",
    "game:replay_start",
    "game:replay_end",
    "game:replay_will_end",
    "game:match_ended",
    "game:podium_start",
    "game:match_destroyed",
    "game:match_created",
    "sos:version",
];
exports.sosStatFeedEvents = [
    "Demolition",
    "Shot on Goal",
    "Goal",
    "Assist",
    "Save",
    "Epic Save",
];
exports.gameStates = [
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
];
var TeamEnum;
(function (TeamEnum) {
    TeamEnum[TeamEnum["blue"] = 0] = "blue";
    TeamEnum[TeamEnum["orange"] = 1] = "orange";
})(TeamEnum = exports.TeamEnum || (exports.TeamEnum = {}));
exports.miscEvents = [
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
];
var isPacket = function (possiblePacket) {
    if (possiblePacket)
        return "data" in possiblePacket && "event" in possiblePacket;
};
exports.isPacket = isPacket;
var isDatedPacket = function (possiblePacket) {
    return (0, exports.isPacket)(possiblePacket) && "date" in possiblePacket;
};
exports.isDatedPacket = isDatedPacket;
exports.ordDatedPacket = fp_ts_1.ord.fromCompare(function (a, b) {
    return fp_ts_1.date.Ord.compare(a.date, b.date);
});

#pragma once
#pragma comment(lib, "PluginSDK.lib")

#include "Classes/WebsocketManager.h"
#include "Classes/NameplatesManager.h"
#include "Classes/BallSpeedManager.h"
#include "Classes/ClockManager.h"
#include "bakkesmod/plugin/bakkesmodplugin.h"
#include "MacrosStructsEnums.h"
#include "json.hpp"

using json = nlohmann::json;

// SOS CLASS
class SOS : public BakkesMod::Plugin::BakkesModPlugin
{
public:
    void onLoad() override;
    void onUnload() override;

private:
    std::string CurrentMatchGuid;
    std::string SilentMatchGuid;

    // CVARS
    std::shared_ptr<bool> cvarEnabled;
    std::shared_ptr<int> cvarPort;
    std::shared_ptr<float> cvarUpdateRate;
    std::shared_ptr<bool> bEnableDebugRendering;

    // MANAGERS
    std::shared_ptr<WebsocketManager> Websocket;
    std::shared_ptr<NameplatesManager> Nameplates;
    std::shared_ptr<BallSpeedManager> BallSpeed;
    std::shared_ptr<ClockManager> Clock;

    // ORIGINAL SOS VARIABLES
    bool firstCountdownHit = false;
    bool matchCreated = false;
    bool isCurrentlySpectating = false;
    bool bInGoalReplay = false;
    bool bInPreReplayLimbo = false;
    bool bBallHasBeenHit = false;
    bool bPendingRestartFromKickoff = false;

    // NEW SOS VARIABLES
    bool bEarlyFinalWhistleBlown = false;

    // GOAL SCORED VARIABLES
    LastTouchInfo lastTouch;
    Vector2F GoalImpactLocation = {0, 0}; // top-left (0,0) bottom right (1,1)
    void GetGameStateInfo(CanvasWrapper canvas, json &state);
    Vector2F GetGoalImpactLocation(BallWrapper ball, void *params);

    // MAIN FUNCTION (GameState.cpp)
    void UpdateGameState(CanvasWrapper canvas);
    // void GetGameStateInfo(CanvasWrapper canvas, json& state);

    // HOOKS (EventHooks.cpp)
    void HookAllEvents();
    void HookViewportTick(CanvasWrapper canvas);
    void HookBallExplode();
    void HookCrossbarHit();
    void HookOnHitGoal(BallWrapper ball, void *params);
    void HookInitTeams();
    std::string GetNowString();
    void SaveMatchGuid();
    void RemoveMatchGuid();
    void HookMatchCreated();
    void HookMatchDestroyed();
    void HookMatchEnded();
    void HookCountdownInit();
    void HookRoundStarted();
    void HookPodiumStart();
    void HookReplayCreated();
    void HookGoalReplayStart();
    void HookGoalReplayEnd();
    void HookStatEvent(ServerWrapper caller, void *params);
    void HookReplayScoreDataChanged(ActorWrapper caller);
    void HookOnFinalWhistle(int winnerTeamNum);

    // TIME HOOKS
    void HookOnTimeUpdated();
    void HookOnOvertimeStarted(); // Is this not needed?
    void HookOnPauseChanged();
    void HookCarBallHit(CarWrapper car, void *params);
    void SetBallHit(bool bHit);

    // DATA GATHERING FUNCTIONS (GameState.cpp)
    void GetPlayerInfo(json &state, ServerWrapper server);
    void GetIndividualPlayerInfo(json &state, PriWrapper pri);
    void GetTeamInfo(json &state, ServerWrapper server);
    void GetGameTimeInfo(json &state, ServerWrapper server);
    void GetBallInfo(json &state, ServerWrapper server);
    void GetCurrentBallSpeed();
    void GetWinnerInfo(json &state, ServerWrapper server);
    void GetArenaInfo(json &state);
    void GetCameraInfo(json &state);
    void GetNameplateInfo(CanvasWrapper canvas);
    void GetLastTouchInfo(CarWrapper car, void *params);
    void GetStatEventInfo(ServerWrapper caller, void *params);

    // GUARD FUNCTIONS (EventHooks.cpp)
    bool CheckForEarlyFinalWhistle();

    // DEMO TRACKER
    std::map<std::string, int> DemolitionCountMap{};
    void DemoCounterIncrement(std::string playerId);
    int DemoCounterGetCount(std::string playerId);

    // DEBUGGING HELP
    void DebugRender(CanvasWrapper Canvas);
    void DrawTextVector(CanvasWrapper Canvas, Vector2 StartPosition, const std::vector<DebugText> &TextVector);
};

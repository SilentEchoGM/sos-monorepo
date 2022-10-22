#include "SOS.h"
#include "SOSUtils.h"
#include "json.hpp"
#include "date.h"
#include <iostream>
#include <chrono>
#include <ctime>
#include <string>

void SOS::HookAllEvents()
{
    using namespace std::placeholders;

    //UPDATE GAME STATE EVERY TICK
    gameWrapper->RegisterDrawable(std::bind(&SOS::HookViewportTick, this, _1));

    //CLOCK EVENTS
    gameWrapper->HookEvent("Function TAGame.GameEvent_Soccar_TA.OnGameTimeUpdated", std::bind(&SOS::HookOnTimeUpdated, this));
    gameWrapper->HookEvent("Function TAGame.GameEvent_Soccar_TA.OnOvertimeUpdated", std::bind(&SOS::HookOnOvertimeStarted, this));
    gameWrapper->HookEvent("Function Engine.WorldInfo.EventPauseChanged", std::bind(&SOS::HookOnPauseChanged, this));
    gameWrapper->HookEventWithCaller<CarWrapper>("Function TAGame.Car_TA.EventHitBall", std::bind(&SOS::HookCarBallHit, this, _1, _2));

    //GAME EVENTS
    gameWrapper->HookEventPost("Function TAGame.Team_TA.PostBeginPlay", std::bind(&SOS::HookInitTeams, this));
    gameWrapper->HookEvent("Function TAGame.GameInfo_Replay_TA.InitGame", std::bind(&SOS::HookReplayCreated, this));
    gameWrapper->HookEventPost("Function TAGame.GameEvent_Soccar_TA.Destroyed", std::bind(&SOS::HookMatchDestroyed, this));
    gameWrapper->HookEventPost("Function GameEvent_Soccar_TA.Countdown.BeginState", std::bind(&SOS::HookCountdownInit, this));
    gameWrapper->HookEvent("Function GameEvent_Soccar_TA.Active.StartRound", std::bind(&SOS::HookRoundStarted, this));
    gameWrapper->HookEvent("Function TAGame.Ball_TA.Explode", std::bind(&SOS::HookBallExplode, this));
    gameWrapper->HookEventWithCaller<BallWrapper>("Function TAGame.Ball_TA.OnHitGoal", std::bind(&SOS::HookOnHitGoal, this, _1, _2));
    gameWrapper->HookEventPost("Function GameEvent_Soccar_TA.ReplayPlayback.BeginState", std::bind(&SOS::HookGoalReplayStart, this));
    gameWrapper->HookEventPost("Function GameEvent_Soccar_TA.ReplayPlayback.EndState", std::bind(&SOS::HookGoalReplayEnd, this));
    gameWrapper->HookEventPost("Function TAGame.GameEvent_Soccar_TA.EventMatchEnded", std::bind(&SOS::HookMatchEnded, this));
    gameWrapper->HookEventPost("Function GameEvent_Soccar_TA.PodiumSpotlight.BeginState", std::bind(&SOS::HookPodiumStart, this));
    gameWrapper->HookEventWithCaller<ServerWrapper>("Function TAGame.PRI_TA.ClientNotifyStatTickerMessage", std::bind(&SOS::HookStatEvent, this, _1, _2));
    gameWrapper->HookEventWithCallerPost<ActorWrapper>("Function TAGame.ReplayDirector_TA.OnScoreDataChanged", std::bind(&SOS::HookReplayScoreDataChanged, this, _1));
}


// GAME STATE //
void SOS::HookViewportTick(CanvasWrapper canvas)
{
    if(!*cvarEnabled || !SOSUtils::ShouldRun(gameWrapper)) { return; }

    UpdateGameState(canvas);
    DebugRender(canvas);
}


// CLOCK EVENTS //
void SOS::HookOnTimeUpdated()
{
    if(!*cvarEnabled || !SOSUtils::ShouldRun(gameWrapper)) { return; }

    //Limit clock updating to only happen within the bounds of normal gameplay
    if(!matchCreated || bInGoalReplay || bInPreReplayLimbo || gameWrapper->IsPaused()) { return; }

    //Unpauses the clock if it's paused and updates its time
    Clock->OnClockUpdated();
}

void SOS::HookOnOvertimeStarted()
{
    if(!*cvarEnabled || !SOSUtils::ShouldRun(gameWrapper)) { return; }
    
    Clock->OnOvertimeStarted();
}

void SOS::HookOnPauseChanged()
{
    if(!*cvarEnabled || !SOSUtils::ShouldRun(gameWrapper)) { return; }

    if(gameWrapper->IsPaused())
    {
        Clock->StopClock();
    }
    else
    {
        if(bPendingRestartFromKickoff)
        {
            //Admin uses "restart from kickoff"
            //Don't start clock now. Let HookRoundStart do that
            bPendingRestartFromKickoff = false;
        }
        else
        {
            //Admin doesn't use "restart from kickoff"
            //PauseChanged automatically fires after the 3 second unpause countdown, no extra delay needed
            Clock->StartClock(false);
        }
    }
}

void SOS::HookCarBallHit(CarWrapper car, void* params)
{
    GetLastTouchInfo(car, params);

    if(!*cvarEnabled || !SOSUtils::ShouldRun(gameWrapper)) { return; }

    SetBallHit(true);
}

void SOS::SetBallHit(bool bHit)
{
    //Sets bBallHasBeenHit to true and starts clock if it needs to be started (i.e. kickoff)
    //Only run this part if the ball has not been hit yet
    if(bHit && !bBallHasBeenHit)
    {
        if(!Clock->IsClockRunning() && !bInGoalReplay)
        {
            Clock->StartClock(true);
        }
    }
    
    bBallHasBeenHit = bHit;
}


// GAME EVENTS //
void SOS::HookInitTeams()
{
    static int NumTimesCalled = 0;

    //"Function TAGame.Team_TA.PostBeginPlay" is called twice rapidly, once for each team
    // Only initialize lobby on the second hook once both teams are ready

    ++NumTimesCalled;
    if(NumTimesCalled >= 2)
    {
        //Set a delay so that everything can be filled in before trying to initialize
        gameWrapper->SetTimeout([this](GameWrapper* gw)
        {
            if(SOSUtils::ShouldRun(gameWrapper))
            {
                HookMatchCreated();
            } else {
                LOGC("ShouldRun returned false. Not initializing lobby.");
            }
        }, .05f);
        
        NumTimesCalled = 0;
    }

    //Reset call counter after 2 seconds in case it never got through the >= 2 check
    if(NumTimesCalled != 0)
    {
        gameWrapper->SetTimeout([this](GameWrapper* gw){ NumTimesCalled = 0; }, 2.f);
    }
}

void SOS::SaveMatchGuid()
{
    ServerWrapper server = SOSUtils::GetCurrentGameState(gameWrapper);
    std::string id;

    if (server.IsNull()) {
        LOGC("Server was null for some reason");
    }
    else {
        id = server.GetMatchGUID();
    }     

    using sc = std::chrono::system_clock;
    
    if (id.empty()) {
        std::time_t t = sc::to_time_t(sc::now());
        char buf[20];
        tm localTime;
        localtime_s(&localTime, &t);
        strftime(buf, 20, "%Y%m%d%H%M%S", &localTime);
        CurrentMatchGuid = "LAN" + std::string(buf);
    }
    else {
        CurrentMatchGuid = id;
    }

    LOGC("MatchID: " + CurrentMatchGuid);
    Clock->UpdateCurrentMatchGuid(CurrentMatchGuid);
}

void SOS::HookMatchCreated()
{
    // Called by HookInitTeams //

    LOGC(" -------------- MATCH CREATED -------------- ");

    SaveMatchGuid();

    Clock->ResetClock();
    matchCreated = true;
    DemolitionCountMap.clear();

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:match_created", event);
}

void SOS::HookReplayCreated()
{
    LOGC(" -------------- REPLAY CREATED -------------- ");

    Clock->ResetClock();
    matchCreated = true;

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:replay_created", event);
}

void SOS::HookMatchDestroyed()
{
    bInGoalReplay = false;
    bInPreReplayLimbo = false;
    matchCreated = false;
    firstCountdownHit = false;
    isCurrentlySpectating = false;
    bPendingRestartFromKickoff = false;
    Clock->ResetClock();
    DemolitionCountMap.clear();

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:match_destroyed", event);
}

void SOS::HookCountdownInit()
{
    //When match admin resets from kickoff, the new countdown starts but it starts paused
    //It will continue when admin unpauses
    if(gameWrapper->IsPaused())
    {
        bPendingRestartFromKickoff = true;
    }

    //Sometimes the match_guid appears not to update on a new game, adding this as braces to the belt
    //SaveMatchGuid();

    json event;
    event["match_guid"] = CurrentMatchGuid;

    if (!firstCountdownHit && SOSUtils::ShouldRun(gameWrapper))
    {
        firstCountdownHit = true;
        Websocket->SendEvent("game:initialized", event);
    }

    Websocket->SendEvent("game:pre_countdown_begin", event);
    Websocket->SendEvent("game:post_countdown_begin", event);
}

void SOS::HookRoundStarted()
{
    bPendingRestartFromKickoff = false;
    bInGoalReplay = false;

    if(!*cvarEnabled || !SOSUtils::ShouldRun(gameWrapper)) { return; }
    
    //Mark the ball as unhit for the kickoff
    SetBallHit(false);

    //Set the delay for the timer to start if the ball hasn't been hit yet
    //Default delay in game is 5 seconds
    gameWrapper->SetTimeout(std::bind(&SOS::SetBallHit, this, true), 5.f);

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:round_started_go", "game_round_started_go");
}

void SOS::HookBallExplode()
{
    BallSpeed->LockBallSpeed();
    Clock->StopClock();

    if (!*cvarEnabled || !matchCreated) { return; }
    
    //Notify that the goal replay will end soon
    if(bInGoalReplay)
    {
        LOGC("Sending ReplayWillEnd Event");

        json event;
        event["match_guid"] = CurrentMatchGuid;
        Websocket->SendEvent("game:replay_will_end", event);
    }
    else
    {
        bInPreReplayLimbo = true;
    }
}

void SOS::HookOnHitGoal(BallWrapper ball, void* params)
{
    //Lock the current ball speed into the cache
    BallSpeed->LockBallSpeed();
    Clock->StopClock();

    GoalImpactLocation = GetGoalImpactLocation(ball, params);
}

void SOS::HookGoalReplayStart()
{
    Clock->StopClock();
    bInGoalReplay = true;
    bInPreReplayLimbo = false;
    Websocket->SendEvent("game:replay_start", "game_replay_start");

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:replay_start", event);
}

void SOS::HookGoalReplayEnd()
{
    bInGoalReplay = false;

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:replay_end", event);
}

void SOS::HookMatchEnded()
{
    bInGoalReplay = false;
    bInPreReplayLimbo = false;
    matchCreated = false;
    firstCountdownHit = false;
    isCurrentlySpectating = false;
    bPendingRestartFromKickoff = false;
    Clock->ResetClock();

    json winnerData;
    winnerData["match_guid"] = CurrentMatchGuid;
    winnerData["winner_team_num"] = NULL;

    ServerWrapper server = SOSUtils::GetCurrentGameState(gameWrapper);
    if (!server.IsNull())
    {
        TeamWrapper winner = server.GetMatchWinner();
        if (!winner.IsNull())
        {
            winnerData["winner_team_num"] = winner.GetTeamNum();
        }
    }

    Websocket->SendEvent("game:match_ended", winnerData);
}

void SOS::HookPodiumStart()
{
    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:podium_start", event);
}

void SOS::HookStatEvent(ServerWrapper caller, void* params)
{
    GetStatEventInfo(caller, params);
}

void SOS::HookReplayScoreDataChanged(ActorWrapper caller)
{
    ReplayDirectorWrapper RDW(caller.memory_address);
    ReplayScoreData ScoreData = RDW.GetReplayScoreData();

    //If ScoredBy is null, that likely means this call was just to reset values
    if(ScoreData.ScoredBy == 0) { return; }

    PriWrapper ScoredBy(ScoreData.ScoredBy);
    std::string ScorerName, ScorerID;
    SOSUtils::GetNameAndID(ScoredBy, ScorerName, ScorerID);

    PriWrapper AssistedBy(ScoreData.AssistedBy);
    std::string AssisterName, AssisterID;
    SOSUtils::GetNameAndID(AssistedBy, AssisterName, AssisterID);

    json goalScoreData;
    goalScoreData["goalspeed"] = SOSUtils::ToKPH(ScoreData.Speed);
    goalScoreData["goaltime"] = ScoreData.Time;
    goalScoreData["impact_location"]["X"] = GoalImpactLocation.X; // Set in HookOnHitGoal
    goalScoreData["impact_location"]["Y"] = GoalImpactLocation.Y; // Set in HookOnHitGoal
    goalScoreData["scorer"]["name"] = ScorerName;
    goalScoreData["scorer"]["id"] = ScorerID;
    goalScoreData["scorer"]["team_num"] = ScoreData.ScoreTeam;
    goalScoreData["assister"]["name"] = AssisterName;
    goalScoreData["assister"]["id"] = AssisterID;
    goalScoreData["ball_last_touch"]["player"] = lastTouch.playerID; // Set in HookCarBallHit
    goalScoreData["ball_last_touch"]["speed"] = lastTouch.speed;     // Set in HookCarBallHit
    Websocket->SendEvent("game:goal_scored", goalScoreData);
}
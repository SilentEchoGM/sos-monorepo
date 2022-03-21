#pragma once
#include "bakkesmod/plugin/bakkesmodplugin.h"

class WebsocketManager;

class ClockManager
{
public:
    ClockManager(std::shared_ptr<GameWrapper> InGameWrapper, std::shared_ptr<WebsocketManager> InWebsocketManager);

    void StartClock(bool bResetCurrentDelta);
    void StopClock();
    bool IsClockRunning() { return bActive; }

    void ResetClock();

    void OnClockUpdated();
    float GetTime(bool bResetCurrentDelta = false);

    void OnOvertimeStarted();

    void UpdateCurrentMatchGuid(std::string MatchGuid);

private:
    ClockManager() = delete; // No default constructor

    std::string CurrentMatchGuid;

    std::shared_ptr<GameWrapper> gameWrapper;
    std::shared_ptr<WebsocketManager> Websocket;

    bool bActive = false;
    bool bIsOvertime = false;
    bool bIsUnlimitedTime = false;
    bool bOvertimeStarted = false;

    int ReadClockTime = 0;
    float DeltaAggregate = 0.f;
};

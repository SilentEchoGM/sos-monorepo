#include "Classes/WebsocketManager.h"
#include "ClockManager.h"
#include "Plugin/SOSUtils.h"

ClockManager::ClockManager(std::shared_ptr<GameWrapper> InGameWrapper, std::shared_ptr<WebsocketManager> InWebsocketManager)
    : gameWrapper(InGameWrapper), Websocket(InWebsocketManager) {}

void ClockManager::StartClock(bool bResetCurrentDelta)
{
    //When overtime starts OnTimeUpdated is called, but we don't want the clock starting then
    if(bOvertimeStarted)
    {
        bOvertimeStarted = false;
        return;
    }

    //Clock is already started
    if(bActive)
    {
        return;
    }

    //Start the clock
    bActive = true;

    //Get the first delta time when clock starts
    GetTime(bResetCurrentDelta);

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:clock_started", event);
}

void ClockManager::StopClock()
{
    bActive = false;

    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:clock_stopped", event);
}

void ClockManager::ResetClock()
{
    StopClock();
    ReadClockTime = 0;
    DeltaAggregate = 0.f;
}

void ClockManager::OnClockUpdated()
{
    if(!bActive)
    {
        StartClock(true);
    }

    //Since this function should only be called when the game time decimal hits 0, reset the aggregate
    DeltaAggregate = 0.f;

    //Get the current second from the game
    ServerWrapper Server = SOSUtils::GetCurrentGameState(gameWrapper);
    if(!Server.IsNull())
    {
        ReadClockTime = Server.GetSecondsRemaining();
    }

    //Send the event even if the server is null and doesnt actually give the time
    json event;
    event["match_guid"] = CurrentMatchGuid;
    Websocket->SendEvent("game:clock_updated_seconds", event);
}

float ClockManager::GetTime(bool bResetCurrentDelta)
{
    using namespace std::chrono;

    //This line is called once (static)
    static steady_clock::time_point SnapshotTime = steady_clock::now();
    
    //Reset the current delta when clock has been unpaused
    if(bResetCurrentDelta)
    {
        SnapshotTime = steady_clock::now();
    }

    //Calculate new delta if the clock is running
    if(bActive)
    {
        auto CurrentTime = steady_clock::now();

        float Delta = duration_cast<duration<float>>(CurrentTime - SnapshotTime).count();
        DeltaAggregate += Delta;

        SnapshotTime = CurrentTime;
    }

    //Aggregate is just supposed to be between full seconds, so reset if it goes too high for some reason
    if(DeltaAggregate >= 1.f || DeltaAggregate < 0.f)
    {
        DeltaAggregate = 0.f;
    }

    //Check the current game status
    ServerWrapper Server = SOSUtils::GetCurrentGameState(gameWrapper);
    if(!Server.IsNull())
    {
        bIsOvertime = Server.GetbOverTime();
        bIsUnlimitedTime = Server.GetbUnlimitedTime();
        int NewReadClockTime = Server.GetSecondsRemaining();
        if(ReadClockTime != NewReadClockTime)
        {
            //In case somehow OnClockUpdated isn't being called, reset the aggregate here when the time changes
            DeltaAggregate = 0.f;
            ReadClockTime = NewReadClockTime;
        }
    }

    //Calculate the current time value
    float OutputTime = 0.f;
    if(bIsOvertime || bIsUnlimitedTime)
    {
        //In-game already rounds up one second, so clock will be off. Noticeable on first touch in overtime
        OutputTime = static_cast<float>(ReadClockTime) + DeltaAggregate - 1.f;
    }
    else
    {
        OutputTime = static_cast<float>(ReadClockTime) - DeltaAggregate;
    }

    //Clamp to 0, don't allow negative numbers
    OutputTime = OutputTime > 0 ? OutputTime : 0;

    return OutputTime;
}

void ClockManager::OnOvertimeStarted()
{
    ResetClock();
    bOvertimeStarted = true;
}

void ClockManager::UpdateCurrentMatchGuid(std::string MatchGuid)
{
    CurrentMatchGuid = MatchGuid;
}

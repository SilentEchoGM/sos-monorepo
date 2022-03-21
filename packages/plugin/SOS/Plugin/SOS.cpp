#include "SOS.h"
#include "SOSUtils.h"

/*
    This is a modified version of DanMB's GameStateApi: https://github.com/DanMB/GameStateApi
    A lot of features merged in from the original SOS plugin: https://gitlab.com/bakkesplugins/sos/sos-plugin
    
    - Modified by CinderBlock
    - Thanks to Martinn for the Stat Feed code (and inadvertently, demolitions)
*/

BAKKESMOD_PLUGIN(SOS, "Simple Overlay System", SOS_VERSION, PLUGINTYPE_THREADED)

std::shared_ptr<CVarManagerWrapper> globalCvarManager;

void SOS::onLoad()
{
    globalCvarManager = cvarManager;

    //Enabled cvar
    cvarEnabled = std::make_shared<bool>(false);
    CVarWrapper registeredEnabledCvar = cvarManager->registerCvar("SOS_Enabled", "1", "Enable SOS plugin", true, true, 0, true, 1);
    registeredEnabledCvar.bindTo(cvarEnabled);
    registeredEnabledCvar.addOnValueChanged([this](std::string cvarName, CVarWrapper newCvar)
    {
        //If mod has been disabled, stop any potentially remaining clock calculations
        if(!*cvarEnabled) { Clock->ResetClock(); }
    });
    
    //Other cvars
    cvarPort = std::make_shared<int>(49122);
    cvarUpdateRate = std::make_shared<float>(100.0f);
    cvarManager->registerCvar("SOS_Port", "49122", "Websocket port for SOS overlay plugin", true).bindTo(cvarPort);
    cvarManager->registerCvar("SOS_state_flush_rate", "100", "Rate at which to send events to websocket (milliseconds)", true, true, 5.0f, true, 2000.0f).bindTo(cvarUpdateRate);

    //Handle all the event hooking (EventHooks.cpp)
    HookAllEvents();

    //Create debug renderer boolean. Debug renderer is called in HookViewportTick
    bEnableDebugRendering = std::make_shared<bool>(false);
    cvarManager->registerCvar("SOS_DebugRender", "0", "Enables on-screen debug text for SOS", true).bindTo(bEnableDebugRendering);

    //Check if there is a game currently active
    gameWrapper->SetTimeout([this](GameWrapper* gw)
    {
        if(SOSUtils::ShouldRun(gameWrapper))
        {
            HookMatchCreated();
        }
    }, 1.f);

    //Create managers
    Websocket  = std::make_shared<WebsocketManager>(cvarManager, *cvarPort);
    BallSpeed  = std::make_shared<BallSpeedManager>(gameWrapper);
    Clock      = std::make_shared<ClockManager>(gameWrapper, Websocket);
    Nameplates = std::make_shared<NameplatesManager>();

    //Run websocket server. Locks onLoad thread
    Websocket->StartServer();
}

void SOS::onUnload()
{
    Websocket->StopServer();
}

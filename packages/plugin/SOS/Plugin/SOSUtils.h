#pragma once
#include "bakkesmod/plugin/bakkesmodplugin.h"
#include "MacrosStructsEnums.h"

namespace SOSUtils
{
    ServerWrapper GetCurrentGameState(std::shared_ptr<GameWrapper> gameWrapper);

    bool ShouldRun(std::shared_ptr<GameWrapper> gameWrapper);
    bool IsSafeMode(int CurrentPlaylist, const std::vector<int>& SafePlaylists);

    float ToKPH(float RawSpeed);

    void GetNameAndID(PriWrapper PRI, std::string& name, std::string& ID);
}

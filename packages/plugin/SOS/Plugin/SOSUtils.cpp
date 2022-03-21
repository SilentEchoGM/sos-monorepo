#include "SOSUtils.h"
#include "RenderingTools.h"

ServerWrapper SOSUtils::GetCurrentGameState(std::shared_ptr<GameWrapper> gameWrapper)
{
    if(gameWrapper->IsInReplay())
		return gameWrapper->GetGameEventAsReplay().memory_address;
	else if(gameWrapper->IsInOnlineGame())
		return gameWrapper->GetOnlineGame();
	else
		return gameWrapper->GetGameEventAsServer();
}

bool SOSUtils::ShouldRun(std::shared_ptr<GameWrapper> gameWrapper)
{
    //Check if server exists
    ServerWrapper server = GetCurrentGameState(gameWrapper);
    if (server.IsNull())
    {
        LOGC("server.IsNull(): (need false) true");
        return false;
    }

    //Allow in replay mode
    if (gameWrapper->IsInReplay())
    {
        return true;
    }

    //Check if player is spectating
    if (!gameWrapper->GetLocalCar().IsNull())
    {
        LOGC("GetLocalCar().IsNull(): (need true) false");
        return false;
    }

    //Check if server playlist exists
    if (server.GetPlaylist().memory_address == NULL)
    {
        LOGC("server.GetPlaylist().memory_address == NULL: (need false) true");
        return false;
    }

    //Check if server playlist is valid
    // 6:  Private Match
    // 22: Custom Tournaments
    // 24: LAN Match
    static const std::vector<int> SafePlaylists = {6, 22, 24};
    int playlistID = server.GetPlaylist().GetPlaylistId();
    if (!IsSafeMode(playlistID, SafePlaylists))
    {
        #if SHOULDLOG //Don't constantly compile the message unless it's going to be printed
        std::string NotSafeMessage;
        NotSafeMessage += "server.GetPlaylist().GetPlaylistId(): (need ";
        
        //Add list of safe modes to string
        for(const auto& Playlist : SafePlaylists)
        {
            NotSafeMessage += std::to_string(Playlist) + ", ";
        }

        //Remove last ", "
        NotSafeMessage.pop_back();
        NotSafeMessage.pop_back();

        NotSafeMessage += ") " + std::to_string(playlistID);
        LOGC(NotSafeMessage);
        #endif

        return false;
    }

    return true;
}

bool SOSUtils::IsSafeMode(int CurrentPlaylist, const std::vector<int>& SafePlaylists)
{
    for(const auto& SafePlaylist : SafePlaylists)
    {
        if (CurrentPlaylist == SafePlaylist)
        {
            return true;
        }
    }

    return false;
}

float SOSUtils::ToKPH(float RawSpeed)
{
    //Raw speed from game is cm/s
    return (RawSpeed * 0.036f);
}

void SOSUtils::GetNameAndID(PriWrapper PRI, std::string& name, std::string& ID)
{
    //Use this whenever you need a player's name and ID in a JSON object
    if (PRI.IsNull())
    {
        name = "";
        ID = "";
    }
    else 
    {
        name = PRI.GetPlayerName().IsNull() ? "" : PRI.GetPlayerName().ToString();
        ID = name + '_' + std::to_string(PRI.GetSpectatorShortcut());
    }
}

#pragma once

#include <set>
#define ASIO_STANDALONE
#define _WEBSOCKETPP_CPP11_TYPE_TRAITS_
#include "websocketpp/config/asio_no_tls.hpp"
#include "websocketpp/server.hpp"
#include "Plugin/MacrosStructsEnums.h"
#include "json.hpp"

using websocketpp::connection_hdl;
using nlohmann::json;
class CVarManagerWrapper;

class WebsocketManager
{
    using PluginServer = websocketpp::server<websocketpp::config::asio>;
    using ConnectionSet = std::set<connection_hdl, std::owner_less<connection_hdl>>;

public:
    WebsocketManager(std::shared_ptr<CVarManagerWrapper> InCvarManager, int InListenPort);

    void StartServer();
    void StopServer();
    
    void SendEvent(std::string eventName, const json& jsawn);
    void SetbUseBase64(bool bNewValue) { bUseBase64 = bNewValue; }

private:
    WebsocketManager() = delete; // No default constructor

    std::shared_ptr<CVarManagerWrapper> cvarManager;
    int ListenPort = 49122;
    bool bUseBase64 = false;
    PluginServer* ws_server = nullptr;
    ConnectionSet* ws_connections = nullptr;

    void OnHttpRequest(connection_hdl hdl);
    void SendWebSocketPayload(const json &jsawn);
    void OnWsMsg(connection_hdl hdl, PluginServer::message_ptr msg);
    void OnWsOpen(connection_hdl hdl);
    void OnWsClose(connection_hdl hdl) { ws_connections->erase(hdl); }

    json::string_t DumpMessage(json jon);
};

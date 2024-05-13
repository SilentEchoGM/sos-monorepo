import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SOSEmulator } from "sos-emulator-types";
import WebSocket from "ws";


export let socketManager: {
  wss: WebSocket.Server | null;
  ws: WebSocket | null;
  frontend: Socket<
  SOSEmulator.FrontendToBackendEvents,
  SOSEmulator.BackendToFrontendEvents,
  DefaultEventsMap,
  any
>|null,
} = {
  wss: null,
  ws: null,
  frontend: null
};

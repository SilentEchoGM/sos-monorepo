import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SOSEmulator } from "sos-emulator-types";
import WebSocket, { WebSocketServer } from "ws";
import { startRecording } from "./recorder";
import { log } from "./socket";
import { socketManager } from "./socketManager";

export const startWSS = (
  socket: Socket<
    SOSEmulator.FrontendToBackendEvents,
    SOSEmulator.BackendToFrontendEvents,
    DefaultEventsMap,
    any
  >,
  port: number = 49122
) =>
  new Promise(async (resolve, reject) => {
    log.info("Starting SOS emulator");

    const wss = new WebSocketServer({
      port,
    });

    wss.on("connection", (ws) => {
      ws.on("message", (data) => {
        log.info("SOS Emulator WS message", data);
      });

      log.info("new-connection, requesting update_state");
      socketManager.frontend?.emit(`new-connection`);
    });

    wss.on("error", (error) => {
      if (error.toString().includes("EADDRINUSE")) {
        socket.emit("wss-port-busy");
        log.warn(`Port ${port} busy, unable to start SOS Emulator WSS`);
        resolve(false);
        return;
      }

      log.error("Error with SOS Emulator WSS", {
        error,
        name: error.name,
        message: error.message,
      });
    });

    wss.on("listening", () => {
      socketManager.wss = wss;
      log.info("SOS Emulator WSS open");
      socket.emit("wss-open");
      resolve(true);
    });

    wss.on("close", () => {
      socketManager.wss = null;
      log.info("SOS Emulator WSS closed");
      socket.emit("wss-closed");
    });
  });

export const startRecordingListener = (
  socket: Socket<
    SOSEmulator.FrontendToBackendEvents,
    SOSEmulator.BackendToFrontendEvents,
    DefaultEventsMap,
    any
  >,
  port: number = 49122
) =>
  new Promise(async (resolve, reject) => {
    log.info("Starting SOS listener");

    const ws = new WebSocket(`ws://localhost:${port}`);
    const recorder = startRecording();

    ws.on("open", () => {
      log.info("Connected to SOS");
      socketManager.ws = ws;
      resolve(true);
    });

    ws.on("error", (err) => {
      if (err.message.includes("ECONNREFUSED")) {
        log.info(
          `No server to listen to at port ${port}, unable to start SOS Listener`
        );
        socket.emit("recording-no-server");
        resolve(false);
        return;
      }
      log.error("SOS listener error", { err, message: err.message });

      socket.emit("recording-stopped");
    });

    ws.on("message", (data) => {
      const parsed = JSON.parse(data.toString());
      recorder.push(parsed);
    });

    ws.on("close", (code, reason) => {
      log.warn("SOS listener closed", { code, reason });
      socket.emit("recording-stopped");
      socketManager.ws = null;
    });
  });

import { SOS } from "sos-plugin-types";
import { startRecordingListener, startWSS } from "./wss";
import { socketManager } from "./socketManager";
import { log } from "./socket";
import { createPlaybackManager } from "./playback";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getListOfPlaybackGames } from "./recorder";
import { SOSEmulator } from "sos-emulator-types";

export const handlers = (
  socket: Socket<
    SOSEmulator.FrontendToBackendEvents,
    SOSEmulator.BackendToFrontendEvents,
    DefaultEventsMap,
    any
  >
) => {
  const playbackManager = createPlaybackManager(socket);

  const sendPacketHandler = (packet: SOS.Packet) => {
    log.info('"send-packet" received.', packet);
    if (!socketManager.wss) {
      log.info("unable to send packet");
      return;
    }
    socketManager.wss.clients.forEach((client) => {
      client.send(JSON.stringify(packet));
    });
  };

  const closeWSSHandler = () => {
    log.info("close-wss received");

    if (!socketManager.wss) return log.info("WSS already closed");

    [...socketManager.wss.clients].map((client) => client.close());
    socketManager.wss.close(() => log.info("Closed WSS"));

    socketManager.wss = null;
  };

  const openWSSHandler = () => {
    log.info("open-wss received");

    if (socketManager.wss) {
      log.info("wss already open");
    } else {
      startWSS(socket);
    }
  };

  const startPlaybackHandler = () => {
    log.info("start-playback");
    playbackManager.startPlayback();
  };

  const stopPlaybackHandler = () => {
    log.info("stop-playback");
    playbackManager.stopPlayback();
  };

  const loadPlaybackHandler = (gameId: string) => {
    log.info("load-playback");
    playbackManager.loadPlayback(gameId);
  };

  const setPlaybackCurrentFrameHandler = (currentFrame: number) => {
    log.info("set-playback-current-frame", currentFrame.valueOf());
    playbackManager.setPlaybackCurrentFrame(currentFrame);
  };

  const getPlaybackLibraryHandler = () => {
    log.info("get-playback-library");
    const library = getListOfPlaybackGames();
    socket.emit("playback-library", library);
  };

  const startRecordingHandler = async () => {
    log.info("start-recording");
    const result = await startRecordingListener(socket);
    if (result) socket.emit("recording-started");
  };

  const stopRecordingHandler = () => {
    log.info("stop-recording");
    socketManager.ws?.close();
    socket.emit("recording-stopped");
  };

  return {
    sendPacketHandler,
    closeWSSHandler,
    openWSSHandler,
    startPlaybackHandler,
    stopPlaybackHandler,
    loadPlaybackHandler,
    setPlaybackCurrentFrameHandler,
    getPlaybackLibraryHandler,
    startRecordingHandler,
    stopRecordingHandler,
  };
};

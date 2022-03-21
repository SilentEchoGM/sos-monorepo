import { pipe, identity } from "fp-ts/function";
import {
  set as S,
  array as A,
  either as E,
  ord as Ord,
  option as O,
  taskEither as TE,
} from "fp-ts";
import { getLogger } from "./logger";
import { loadGame } from "./recorder";
import { socketManager } from "./socketManager";
import type { WebSocket } from "ws";
import { stringify } from "fp-ts/lib/Json";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SOSEmulator } from "sos-emulator-types";
import { DatedPacket } from "sos-plugin-types";
const log = getLogger({ filepath: "emulator-electron/src/lib/playback.ts" });

type PlaybackManager = {
  currentFrame: number;
  gameId: O.Option<string>;
  loaded: boolean;
  timeout: O.Option<NodeJS.Timeout>;
  playing: boolean;
  packets: DatedPacket[];
};

const optionClearTimeout = (timeout: O.Option<NodeJS.Timeout>) =>
  O.ap(timeout)(O.some(clearTimeout));

export const createPlaybackManager = (
  socket: Socket<
    SOSEmulator.FrontendToBackendEvents,
    SOSEmulator.BackendToFrontendEvents,
    DefaultEventsMap,
    any
  >
) => {
  const manager: PlaybackManager = {
    currentFrame: 0,
    gameId: O.none,
    loaded: false,
    timeout: O.none,
    playing: false,
    packets: [],
  };

  const sendNextFrame = () => {
    if (!socketManager.wss) {
      log.error(
        `socketManager.wss is null, unable to send packet #${manager.currentFrame}. Stopping playback.`
      );
      socket.emit("playback-stopped");
      return;
    }

    socket.emit("playback-current-frame", manager.currentFrame);

    pipe(
      socketManager.wss.clients,
      S.toArray(Ord.trivial as Ord.Ord<WebSocket>),
      A.map((client) => {
        const { date, ...packet } = manager.packets[manager.currentFrame];
        const json = pipe(
          packet,
          stringify,
          E.fold((reason) => {
            log.warn("Unable to stringify packet", { reason, packet });
            return "";
          }, identity)
        );

        if (json) {
          client.send(json);
          log.info(`packet #${manager.currentFrame} sent`);
        }
      })
    );

    if (manager.currentFrame + 1 > manager.packets.length) {
      log.info("Last packet sent", {
        currentFrame: manager.currentFrame,
        length: manager.packets.length,
      });
      socket.emit("playback-stopped");
      return;
    }

    if (!manager.playing) return;

    const time =
      manager.packets[manager.currentFrame + 1].date.valueOf() -
      manager.packets[manager.currentFrame].date.valueOf();
    optionClearTimeout(manager.timeout);
    manager.currentFrame++;

    manager.timeout = O.some(setTimeout(sendNextFrame, time));
  };

  const stopPlayback = () => {
    manager.playing = false;
    optionClearTimeout(manager.timeout);
    socket.emit("playback-stopped");
  };

  const startPlayback = () => {
    if (O.isSome(manager.timeout)) {
      optionClearTimeout(manager.timeout);
    }
    manager.playing = true;
    sendNextFrame();
    socket.emit("playback-started");
  };

  const loadPlayback = async (gameId: string) => {
    log.info(`Loading game ${gameId}`);
    const packets = await loadGame(gameId)();
    log.info(`Loaded game ${gameId}`, { length: packets?.length });

    if (!packets?.length) {
      log.warn("Packets length", { packets });
      socket.emit("playback-load-error");
      return;
    }

    socket.emit("playback-loaded", packets.length);
    manager.gameId = O.some(gameId);
    manager.packets = packets;
    manager.currentFrame = 0;
  };

  const setPlaybackCurrentFrame = (currentFrame: number) => {
    manager.currentFrame = currentFrame;
    socket.emit("playback-current-frame", manager.currentFrame);
  };

  return {
    sendNextFrame,
    stopPlayback,
    startPlayback,
    loadPlayback,
    setPlaybackCurrentFrame,
  };
};

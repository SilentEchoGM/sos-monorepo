import { io, Socket } from "socket.io-client";
import type { SOSEmulator } from "sos-emulator-types";
import { isPacket } from "sos-plugin-types";
import { writable, type Writable } from "svelte/store";
import { getLogger } from "./logger";

type SocketIOFrontendToBackendPayloadData<
  T extends keyof SOSEmulator.FrontendToBackendEvents
> = Parameters<SOSEmulator.FrontendToBackendEvents[T]>[0];

type SocketIOFrontendToBackendPayload<
  T extends keyof SOSEmulator.FrontendToBackendEvents
> = {
  channel: T;
  data: SocketIOFrontendToBackendPayloadData<T>;
};

type SocketIOBackendToFrontendPayload = {
  channel: keyof SOSEmulator.BackendToFrontendEvents;
  data: any;
};

const isCorrectParameterType = <
  T extends keyof SOSEmulator.FrontendToBackendEvents
>(
  channel: T,
  parameter: any
): parameter is SocketIOFrontendToBackendPayloadData<T> => {
  if (typeof parameter === "string" && channel === "load-playback") return true;
  if (typeof parameter === "number" && channel === "set-playback-current-frame")
    return true;
  if (isPacket(parameter) && channel === "send-packet") return true;
  if (
    !parameter &&
    [
      "close-wss",
      "open-wss",
      "start-playback",
      "stop-playback",
      "get-playback-library",
      "start-recording",
      "stop-recording",
      "new-connection",
    ].includes(channel)
  )
    return true;

  return false;
};

const log = getLogger({ filepath: "svelte/src/lib/frontend/socket.ts" });

type SocketStore = Pick<
  Writable<SocketIOBackendToFrontendPayload>,
  "subscribe"
> & {
  set: <T extends keyof SOSEmulator.FrontendToBackendEvents>({
    channel,
    data,
  }: SocketIOFrontendToBackendPayload<T>) => void;
  send: <T extends keyof SOSEmulator.FrontendToBackendEvents>({
    channel,
    data,
  }: SocketIOFrontendToBackendPayload<T>) => void;
  socket: Socket;
  get connected(): boolean;
  history: SocketIOBackendToFrontendPayload[];
};

export const createSocketStore = (): SocketStore => {
  const { subscribe, set } = writable<SocketIOBackendToFrontendPayload>({
    channel: "initial",
    data: {},
  });

  const socket: Socket<
    SOSEmulator.BackendToFrontendEvents,
    SOSEmulator.FrontendToBackendEvents
  > = io("ws://localhost:34001", {
    query: {
      process: "frontend",
    },
  });

  const history: SocketIOBackendToFrontendPayload[] = [];

  const pushToHistory = (payload: SocketIOBackendToFrontendPayload) => {
    const cacheMax = 100;
    const newHistory = [payload, ...history.slice(0, cacheMax)];
    history.length = 0;
    history.push(...newHistory);
  };

  const send = ({
    channel,
    data,
  }: SocketIOFrontendToBackendPayload<typeof channel>) => {
    log.verbose("Sending socket message", { channel, data });
    if (!isCorrectParameterType(channel, data)) {
      log.warn("Incorrect call to api", { channel, data });
      return;
    } else {
      socket.emit(channel, data);
    }
  };

  socket.on("connect", () => {
    log.info("Frontend connected to ioBackend.");
  });

  socket.onAny((channel, data) => {
    const payload = { channel, data } as SocketIOBackendToFrontendPayload;
    set(payload);
    pushToHistory(payload);
  });

  return {
    set: send,
    send,
    subscribe,
    socket,
    get connected() {
      return socket.connected;
    },
    history,
  };
};

export const socket = createSocketStore();

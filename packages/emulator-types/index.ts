import type { DatedPacket, SOS } from "sos-plugin-types";

export namespace SOSEmulator {
  export interface FrontendToBackendEvents {
    "send-packet": (packet: SOS.Packet) => void;
    "close-wss": () => void;
    "open-wss": () => void;
    "load-playback": (gameId: string) => void;
    "start-playback": () => void;
    "stop-playback": () => void;
    "set-playback-current-frame": (currentFrame: number) => void;
    "get-playback-library": () => void;
    "start-recording": () => void;
    "stop-recording": () => void;
  }
  export interface BackendToFrontendEvents {
    "wss-closed": () => void;
    "wss-open": () => void;
    "wss-port-busy": () => void;
    "playback-started": () => void;
    "playback-stopped": () => void;
    "playback-library": (library: string[]) => void;
    "playback-length": (length: number) => void;
    "playback-loaded": (data: {
      length: number;
      statEvents: DatedPacket<SOS.GameStatFeedEvent>[];
    }) => void;
    "playback-current-frame": (currentFrame: number) => void;
    "playback-load-error": () => void;
    "recording-started": () => void;
    "recording-stopped": () => void;
    "recording-no-server": () => void;
    "new-connection": () => void;

    //for frontend only
    initial: () => void;
  }
}

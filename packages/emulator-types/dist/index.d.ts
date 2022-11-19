import type { SOS } from "sos-plugin-types";
export declare namespace SOSEmulator {
    interface FrontendToBackendEvents {
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
    interface BackendToFrontendEvents {
        "wss-closed": () => void;
        "wss-open": () => void;
        "wss-port-busy": () => void;
        "playback-started": () => void;
        "playback-stopped": () => void;
        "playback-library": (library: string[]) => void;
        "playback-length": (length: number) => void;
        "playback-loaded": (length: number) => void;
        "playback-current-frame": (currentFrame: number) => void;
        "playback-load-error": () => void;
        "recording-started": () => void;
        "recording-stopped": () => void;
        "recording-no-server": () => void;
        "new-connection": () => void;
        initial: () => void;
    }
}
//# sourceMappingURL=index.d.ts.map
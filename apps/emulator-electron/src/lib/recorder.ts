import { app } from "electron";
import {
  array as A,
  json as J,
  option as O,
  task as T,
  taskEither as TE,
} from "fp-ts";
import { pipe } from "fp-ts/function";
import * as fs from "fs-extra";
import { join } from "path";
import {
  DatedPacket,
  isDatedPacket,
  ordDatedPacket,
  SOS,
} from "sos-plugin-types";
import { getLogger } from "./logger";

const log = getLogger({ filepath: "emulator-electron/src/lib/recorder.ts" });

const isMiscPacket = (packet: SOS.Packet): packet is SOS.GameMisc =>
  typeof packet.data !== "string" && "match_guid" in packet.data;

const isPacket = (packet: any): packet is SOS.Packet =>
  "data" in packet && "event" in packet;

const PATH_TO_RECORDINGS = join(app.getPath("userData"), "recordings");

fs.ensureDirSync(PATH_TO_RECORDINGS);
const getGamePath = (gameId: string) =>
  join(PATH_TO_RECORDINGS, gameId + ".packets");

export const startRecording = () => {
  let currentGameId = "";

  const push = (packet: SOS.Packet) => {
    if (!isPacket(packet)) {
      log.warn("Recorder received an unrecognized packet format", packet);
      return;
    }

    if (isMiscPacket(packet)) {
      currentGameId = packet.data.match_guid;
      fs.ensureFileSync(getGamePath(currentGameId));
    }

    if (currentGameId === "") {
      log.warn("Recorder does not have a gameId", packet);
      return;
    }

    const line = JSON.stringify({
      ...packet,
      date: new Date(),
    });

    fs.appendFile(getGamePath(currentGameId), line + "\n").catch(log.error);
  };

  return {
    push,
  };
};

const parsePackets = (line: string): O.Option<DatedPacket<SOS.Packet>> =>
  pipe(
    line,
    J.parse,
    O.fromEither,
    O.filter(isDatedPacket),
    O.map((packet) => ({
      ...packet,
      date: new Date(packet.date),
    }))
  );

export const parseGame = (buf: Buffer) =>
  pipe(
    buf,
    (buf) => buf.toString(),
    (raw: string) => raw.split("\n"),
    A.filterMap(parsePackets),
    A.sort(ordDatedPacket)
  );

export const loadGame = (gameId: string) =>
  pipe(
    TE.tryCatch(
      () => fs.readFile(getGamePath(gameId)),
      (reason) => new Error(`Unable to read game ${gameId} file: ${reason}`)
    ),
    TE.map(parseGame),
    TE.foldW(
      (err) => T.of(log.error(`Error loading game ${gameId}.`, err)),
      T.of
    )
  );

export const getListOfPlaybackGames = () =>
  pipe(
    fs.readdirSync(PATH_TO_RECORDINGS),
    A.filter((filename) => filename.includes(".packets")),
    A.map((filename) => filename.slice(0, -8))
  );

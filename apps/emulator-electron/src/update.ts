import axios from "axios";
import electronIsDev from "electron-is-dev";
import { autoUpdater, UpdateInfo } from "electron-updater";
import { getLogger } from "./lib/logger";

const log = getLogger({ filepath: "electron/update.ts" });

const baseURL = "http://sosemu.silentecho.eu";

export const startUpdate = () => {
  log.info("Quit and update.");
  autoUpdater.quitAndInstall();
};

export const checkForUpdates = async () => {
  if (electronIsDev) {
    log.info("Can't check for updates in dev mode");
    return;
  }
  try {
    const latestVersion = await axios.get(`${baseURL}/check`);

    log.info(`Latest version: ${latestVersion}`);

    autoUpdater.setFeedURL(`${baseURL}/versions/${latestVersion}`);

    log.info("Checking for updates");

    const result = await autoUpdater.checkForUpdates();

    log.info("Checked for updates", { result });
  } catch (err) {
    log.error("Unable to check for updates", { err });
    return;
  }
};

autoUpdater.logger = log;

autoUpdater.on("update-available", (info: UpdateInfo) => {
  log.info("U222: update-available", { info });
});

autoUpdater.on("update-not-available", (info: UpdateInfo) => {
  log.info("U223: update-not-available", { info });
});

autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
  log.info("U224: update-downloaded", { info });
});

autoUpdater.on("error", (err) => {
  log.info("U225: error", { err });
});

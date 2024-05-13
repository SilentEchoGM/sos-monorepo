import { fork } from "child_process";
import { config } from "dotenv";
import { app, BrowserWindow, Menu, shell } from "electron";
import { join } from "path";
import { URL } from "url";
import { getLogger } from "./lib/logger";
import { startSocketIOListening } from "./lib/socket";
config();

const log = getLogger({ filepath: "electron/main.ts" });

const dev = process.env.NODE_ENV === "development";

log.info(`dev ${dev ? 1 : 0}`, process.env);

const iconPath = dev
  ? "../emulator-svelte/public/graphics/logo.png"
  : join(__dirname, "..", "svelte", "public", "graphics", "logo.png");

log.info(`Icon: ${iconPath}`);

if (!dev) {
  const kit = fork(join(__dirname, "..", "svelte"));

  kit.on("error", (err) => {
    log.error("SvelteKit error", err);
  });

  process.on("beforeExit", () => {
    kit.kill();
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 945,
    height: 820,
    minWidth: 945,
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
    backgroundColor: "#322214",
    icon: iconPath,

    roundedCorners: true,
    title: `SOS Emulator - ${app.getVersion()}`,
  });

  const url = new URL(
    dev
      ? "http://localhost:34952"
      : `file:///${__dirname}/../../svelte/index.html`
  ).toString();

  win.loadURL(url).catch((err) => {
    if (err) {
      setTimeout(() => {
        win.loadURL(url).catch((err) => {
          log.error(
            "Retried once, looks like the port is blocked or the Svelte server is having an issue.",
            {
              err,
            }
          );
        });
      }, 3000);
    }
  });

  if (dev) win.webContents.openDevTools();

  // menu creation
  const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] =
    [
      {
        label: "File",
        submenu: [
          {
            label: "Download SOS",
            click: () => {
              shell.openExternal(
                "https://github.com/SilentEchoGM/sos-monorepo/releases/download/plugin-v1.6.1-beta.1/SOS.dll"
              );
            },
          },
          {
            label: "Open Data Folder",
            click: () => {
              shell.openPath(join(app.getPath("userData")));
            },
          },
          {
            role: "quit",
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
        ],
      },
      {
        label: "Window",
        submenu: [{ role: "minimize" }],
      },
    ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(createWindow);

process.on("uncaughtException", (err) => {
  // Handle the error
  console.error("Uncaught exception", err);
});

startSocketIOListening();

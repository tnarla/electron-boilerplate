import { app, Tray } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import { Menubar, menubar } from "menubar";

const isDevelopment = process.env.NODE_ENV !== "production";

let mb: Menubar | null = null;

app.on("ready", () => {
  const tray = new Tray(path.resolve(__dirname, "truwuTemplate.png"));
  tray.on("mouse-down", () => {
    mb?.window?.webContents.send("trayMouseDown");
  });

  tray.on("mouse-up", () => {
    mb?.window?.webContents.send("trayMouseUp");
  });

  mb = menubar({
    tray,
    index: isDevelopment
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
      : formatUrl({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file",
          slashes: true,
        }),
    tooltip: "Electron",
    browserWindow: {
      height: 1000,
      width: 100,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    },
    showOnAllWorkspaces: true,
    preloadWindow: true,
    showOnRightClick: true,
  });

  mb.on("after-create-window", () => {
    // By default, menubar populates double-click with right-click behavior. This disables that:
    tray.removeAllListeners("double-click");

    if (isDevelopment) {
      mb?.window?.webContents.openDevTools({ mode: "undocked" });
    }
  });
});

// quit application when all windows are closed
app.on("window-all-closed", (event: Event) => {
  app.dock.hide();
  event.preventDefault();
});

// import { app, Menu, Tray } from "electron";
// import path from "path";

// let tray = null;
// app.whenReady().then(() => {
//   tray = new Tray(path.resolve(__dirname, "truwuTemplate.png"));
//   tray.on("mouse-down", () => {
//     console.log("MOUSE DOWN");
//   });
//   tray.on("mouse-up", () => {
//     console.log("MOUSE UP");
//   });
//   tray.setToolTip("This is my application.");
// });

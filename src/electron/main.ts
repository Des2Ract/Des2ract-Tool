import { app, BrowserWindow } from "electron";
import { isDev } from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  // Open DevTools for debugging
  if (isDev()) {
    mainWindow.webContents.openDevTools();
  }
});

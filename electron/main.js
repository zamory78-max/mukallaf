const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

const APP_URL = "https://claude.ai/artifact/Ry83nfL2xAGtpioCEZt4kp";

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 380,
    minHeight: 560,
    icon: path.join(__dirname, "build", "icon.ico"),
    title: "مُكَلَّف",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL(APP_URL);

  // Open any target="_blank" link (e.g. opened documents) in the user's
  // default browser instead of a new Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

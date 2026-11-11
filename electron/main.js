const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

// The app is fully standalone now: its own HTML/JS bundled below, syncing
// over the internet directly with Firebase (no claude.ai account needed).
const APP_FILE = path.join(__dirname, "app", "index.html");

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

  win.loadFile(APP_FILE);

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

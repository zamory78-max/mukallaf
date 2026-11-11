const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

// The app is fully standalone now: its own HTML/JS bundled below, syncing
// over the internet directly with Firebase (no claude.ai account needed).
// The install path contains Arabic characters (the product name), and
// win.loadFile() has a known history of mis-encoding non-ASCII Windows
// paths (silent blank window, no error). pathToFileURL() encodes the
// path correctly on every platform, so we build the URL ourselves and
// use loadURL() instead of relying on loadFile()'s own path handling.
const APP_FILE = path.join(__dirname, "app", "index.html");
const APP_URL = pathToFileURL(APP_FILE).toString();

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

  // If the page fails to load for any reason, show what happened instead
  // of leaving a silent blank window.
  win.webContents.on("did-fail-load", (_event, code, desc) => {
    dialog.showErrorBox(
      "تعذّر فتح التطبيق",
      `تعذّر تحميل صفحة التطبيق.\nرمز الخطأ: ${code} (${desc})\nالمسار: ${APP_FILE}`
    );
  });

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

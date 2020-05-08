process.env.NODE_ENV = 'production'; // change this value to 'development' while developing

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

const app = electron.app;

if (process.env.NODE_ENV === 'development') {
  /*  require('electron-reload')(__dirname);
   const logger = require('electron-timber'); */
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "qikQR",
    width: 344,
    height: 540,
    resizable: false,
    frame: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app', 'view', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  //mainWindow.webContents.openDevTools();
}

app.on('ready', function () {
  // NOTE  for development purpose electron process GUI

  /*   const { openProcessManager } = require('electron-process-manager');
    openProcessManager(); */
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    // logger.warn("app going to Quit");
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("update the settings config", (event, arg) => {
  //logger.log("new configuration set by user which need to be updated ");
  mainWindow.webContents.send("update config", "update");
});

ipcMain.on("logger", (event, arg) => {
  if (arg == "settings: save button clicked") {
    mainWindow.webContents.send("update-config", "true");
    //logger.log("sent to renderer to update the config-data");
  }
});

ipcMain.on("logger-error", (event, arg) => {
  //logger.error(arg);
});

ipcMain.on("logger-warn", (event, arg) => {
  //logger.warn(arg);
});
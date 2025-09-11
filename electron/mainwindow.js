const { BrowserWindow } = require('electron');
const path = require('path');

function createWindow(ENV) {

    const windowOptions = {
        width: 450,
        height: 540,
        icon: path.join(__dirname, "assets", "water_drop.ico"),
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            backgroundThrottling: false,
            preload: path.join(__dirname, 'preload.js')
        },
        transparent: true,
        resizable: false,
        frame: false,
        show: false,
    }

    switch (ENV) {
        case "development":
            windowOptions.width += 252;//to devTools
            windowOptions.height += 57;//to avoid window frame pixels
            windowOptions.resizable = true;
            windowOptions.frame = true;
            windowOptions.transparent = false;
            windowOptions.show = true;
            break;
        case "test":
            windowOptions.height += 57;//to avoid window frame pixels
            windowOptions.resizable = true;
            windowOptions.frame = true;
            windowOptions.transparent = false;
            windowOptions.show = true;
            break;
        default:
            break;
    }

    const mainwindow = new BrowserWindow(windowOptions);

    mainwindow.setOverlayIcon(path.join(__dirname, "assets", "settings.ico"), "development");

    switch (ENV) {
        case "development":
            // mainwindow.webContents.openDevTools();
            mainwindow.loadURL("http://localhost:3000");
            break;
        case "test":
        // mainwindow.webContents.openDevTools();
        case "production":
            mainwindow.loadFile(path.join(__dirname, '../builds/main/index.html'));
            break;
    }

    return mainwindow;
}

module.exports = createWindow;
const { BrowserWindow } = require('electron');
const path = require('path');

const width = 400, height = 500;

module.exports = function createWindow(ENV) {

    const windowOptions = {
        width,
        height,
        icon: path.join(__dirname, "../assets", "water_drop.ico"),
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            preload: path.join(__dirname, '../preloads', 'mainpreload.js')
        },
        resizable: false,
        frame: false,
        show: false,
        maximizable: false,
    }

    switch (ENV) {
        case "development":
            // windowOptions.width += 252;//to devTools 
            windowOptions.height += 57;//to avoid window frame pixels
            windowOptions.resizable = false;
            windowOptions.frame = true;
            windowOptions.show = true;
            break;
        case "test":
            windowOptions.resizable = false;
            windowOptions.frame = false;
            windowOptions.show = true;
            break;
        default:
            break;
    }

    const mainwindow = new BrowserWindow(windowOptions);

    mainwindow.setOverlayIcon(path.join(__dirname, "../assets", "settings.ico"), "development");

    switch (ENV) {
        case "development":
            // mainwindow.webContents.openDevTools();
            mainwindow.loadURL("http://localhost:3000");
            break;
        case "test":
        // mainwindow.webContents.openDevTools();
        case "production":
            mainwindow.loadFile(path.join(__dirname, '../../builds/main/index.html'));
            break;
    }

    return mainwindow;
}
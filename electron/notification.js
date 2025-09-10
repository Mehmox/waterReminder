const { BrowserWindow, screen } = require('electron');
const path = require('path');
const env = require("./env.json").env;

function createNotification() {
    const primaryDisplay = screen.getPrimaryDisplay();

    const windowOptions = {
        width: 400,
        height: 250,
        x: primaryDisplay.workAreaSize.width - 400 - 10,
        y: primaryDisplay.workAreaSize.height - 250 - 15,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        transparent: true,
        resizable: false,
        frame: false,
        show: false,
    }

    switch (env) {
        case "development":
            windowOptions.resizable = true;
            windowOptions.frame = false;
            windowOptions.transparent = false;
            windowOptions.height += 200;
            windowOptions.x = 15;
            windowOptions.y = primaryDisplay.workAreaSize.height - windowOptions.height - 15;
        case "test":
            // windowOptions.show = true;
            break;
    }

    const notification = new BrowserWindow(windowOptions);

    notification.setSkipTaskbar(true);

    switch (env) {
        case "development":
            // notification.webContents.openDevTools();
            notification.loadURL("http://localhost:3005");
            break;
        case "test":
            notification.webContents.openDevTools();
        case "production":
            notification.loadFile(path.join(__dirname, '../build/noti/build/index.html'));
            break;
    }

    return notification;
}
module.exports = createNotification;
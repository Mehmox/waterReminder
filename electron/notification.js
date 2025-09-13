const { BrowserWindow } = require('electron');
const path = require('path');

const width = 400, height = 250;

function createNotification(ENV, primaryWidth, primaryHeight) {

    const windowOptions = {
        width,
        height,
        x: primaryWidth - width - 5,
        y: primaryHeight - height - 5,
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
        maximizable: false,
    }

    switch (ENV) {
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
        default:
            break;
    }

    const notification = new BrowserWindow(windowOptions);

    switch (ENV) {
        case "development":
            // notification.webContents.openDevTools();
            notification.loadURL("http://localhost:3005");
            break;
        case "test":
        // notification.webContents.openDevTools();
        case "production":
            notification.loadFile(path.join(__dirname, '../builds/noti/index.html'));
            break;
    }

    return notification;
}

module.exports = createNotification;
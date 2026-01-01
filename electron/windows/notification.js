const { BrowserWindow } = require('electron');
const path = require('path');

const width = 400, height = 250;

module.exports = function createNotification(ENV, primaryWidth, primaryHeight) {

    const windowOptions = {
        width,
        height,
        x: primaryWidth - width - 5,
        y: primaryHeight - height - 5,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'notificationpreload.js'),
        },
        resizable: false,
        frame: false,
        show: false,
        maximizable: false,
    }

    switch (ENV) {
        case "development":
            windowOptions.resizable = true;
            windowOptions.frame = false;
            windowOptions.x = 15;
            windowOptions.height += 200;//to see the console outputs
            windowOptions.y = primaryHeight - windowOptions.height - 15;//to adapt extra height
        case "test":
            // windowOptions.show = true;
            break;
        default:
            break;
    }

    const notification = new BrowserWindow(windowOptions);

    switch (ENV) {
        case "development":
            notification.webContents.openDevTools();
            notification.loadURL("http://localhost:3005");
            break;
        case "test":
        // notification.webContents.openDevTools();
        case "production":
            notification.loadFile(path.join(__dirname, '../../builds/noti/index.html'));
            break;
    }

    return notification;
}
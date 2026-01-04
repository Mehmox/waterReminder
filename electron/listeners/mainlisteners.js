const { ipcMain } = require('electron');
const fs = require("fs");

module.exports = function mainlisteners(counter_path, config_path, config, counter, ENV, mainwindow, notification) {
    ipcMain.handleOnce("setup-main-config", () => config);
    ipcMain.handleOnce("setup-main-counter", () => counter);
    ipcMain.handleOnce("setup-main-env", () => ENV);

    ipcMain.on("hide-settings", () => mainwindow.hide());
    ipcMain.on("show-noti", () => notification.showInactive());

    ipcMain.on("save-config", (_, newConfigObject) => {
        notification.hide();

        for (const configKey in newConfigObject) {
            config[configKey] = newConfigObject[configKey];
        }

        notification.setAlwaysOnTop(config.alwaysOnTop);

        fs.writeFileSync(config_path, JSON.stringify(config, null, 4));

        notification.webContents.send("set-config-from-main-to-noti", config);
    });

    ipcMain.on("save-counter", (event, value) => {
        notification.hide();

        fs.writeFileSync(counter_path, value.toString());

        notification.webContents.send("set-counter-from-main-to-noti", value);
    });

    mainwindow.on("moved", () => {
        const { x, y } = mainwindow.getBounds();
        config.x = x;
        config.y = y;
        fs.writeFileSync(config_path, JSON.stringify(config, null, 4));
    });
}
const { ipcMain } = require('electron');
const fs = require("fs");

module.exports = function notilisteners(counter_path, config, counter, mainwindow, notification) {
    ipcMain.handleOnce("setup-noti-config", () => config);
    ipcMain.handleOnce("setup-noti-counter", () => counter);

    ipcMain.on("hide-noti", () => {
        notification.hide();

        let current = parseInt(fs.readFileSync(counter_path, "utf8"));

        current++;

        fs.writeFileSync(counter_path, current.toString());

        mainwindow.webContents.send("ping-main-counter", current);
    });
}
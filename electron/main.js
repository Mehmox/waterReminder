const { app, ipcMain } = require('electron');
const winreg = require("winreg");
const fs = require("fs");
const path = require('path');
const ENV = process.env.NODE_ENV|| require('../package.json').env.NODE_ENV;
console.log(`NODE_ENV: ${ENV}`);

const createTray = require("./tray");
const createWindow = require("./mainwindow");
const createNotification = require("./notification");

const config_path = path.join(app.getPath("userData"), "config.json");
const counter_path = path.join(app.getPath("userData"), "counter.txt");
const Logs = { getPath: app.getPath("exe"), isPacked: app.isPackaged };

app.whenReady().then(() => {
  //create          
  const tray = createTray(ENV);
  const mainwindow = createWindow(ENV);
  const notification = createNotification(ENV);

  //file       
  if (!fs.existsSync(counter_path)) fs.writeFileSync(counter_path, "0")

  let config;
  if (fs.existsSync(config_path))
    config = JSON.parse(fs.readFileSync(config_path, "utf-8"))
  else {
    config = { alwaysOnTop: false, limit: 0, cup: 0, cooldown: 0, timeType: 1000, message: "" };

    fs.writeFileSync(config_path, JSON.stringify(config, null, 4));

    if (ENV === "production") {
      const regKey = new winreg({
        hive: winreg.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
      });

      regKey.set('Water-Reminder', winreg.REG_SZ, `"${app.getPath('exe')}"`, (err) => {
        if (err) Logs.regedit = err.message || "error";
        else Logs.regedit = "success";
        getAppInfo();
      });
    }
  }

  notification.setAlwaysOnTop(config.alwaysOnTop);
  mainwindow.showInactive();

  //listeners          
  tray.on("click", () => mainwindow.showInactive());

  ipcMain.handleOnce("setup-main-config", () => config);
  ipcMain.handleOnce("setup-main-counter", () => parseInt(fs.readFileSync(counter_path, "utf-8")));
  ipcMain.handleOnce("setup-noti-config", () => config);

  ipcMain.on("hide-settings", () => mainwindow.hide());
  ipcMain.on("show-noti", () => notification.showInactive());

  ipcMain.on("save-config", (event, newConfig) => {
    notification.hide();

    notification.setAlwaysOnTop(newConfig.alwaysOnTop);

    fs.writeFileSync(config_path, JSON.stringify(newConfig, null, 4));

    notification.webContents.send("set-changes-from-main-to-noti", newConfig);
  });

  ipcMain.on("save-counter", (event, value) => {
    notification.hide();

    fs.writeFileSync(counter_path, value.toString());
  });

  ipcMain.on("hide-noti", () => {
    notification.hide();

    let current = parseInt(fs.readFileSync(counter_path, "utf8"));

    current++;

    fs.writeFileSync(counter_path, current.toString());

    mainwindow.webContents.send("ping-main-counter", current);
  });

  if (ENV !== "production") getAppInfo();

});

function getAppInfo() {
  const targetPath = path.join(app.getPath("userData"), "SystemLogs.json");

  let SystemLogs = {};

  if (fs.existsSync(targetPath)) SystemLogs = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

  SystemLogs[ENV] = Logs;
  SystemLogs[ENV].date = new Date().toLocaleTimeString("tr-TR");

  fs.writeFileSync(targetPath, JSON.stringify(SystemLogs, null, 4));
}
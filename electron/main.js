const { app, ipcMain, screen } = require('electron');
const winreg = require("winreg");
const fs = require("fs");
const path = require('path');
const ENV = process.env.NODE_ENV || require('../package.json').env.NODE_ENV;
console.log(`NODE_ENV: ${ENV}`);

const createTray = require("./tray");
const createWindow = require("./mainwindow");
const createNotification = require("./notification");

const config_path = path.join(app.getPath("userData"), "config.json");
const counter_path = path.join(app.getPath("userData"), "counter.txt");
const Logs = { getPath: app.getPath("exe"), isPacked: app.isPackaged };

app.whenReady().then(() => {

  const primaryDisplay = screen.getPrimaryDisplay();

  const mainWidth = 450, mainHeight = 540;

  //file       
  if (!fs.existsSync(counter_path)) fs.writeFileSync(counter_path, "0")
  let config;
  if (fs.existsSync(config_path))
    config = JSON.parse(fs.readFileSync(config_path, "utf-8"))
  else {
    let x = primaryDisplay.workAreaSize.width / 2 - mainWidth/2, y = primaryDisplay.workAreaSize.height / 2 - mainHeight/2;

    config = { alwaysOnTop: false, limit: 0, cup: 0, cooldown: 0, timeType: 1000, message: "", x, y };

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

  //create          
  const tray = createTray(ENV);
  const mainwindow = createWindow(ENV, mainWidth, mainHeight);
  const notification = createNotification(ENV, primaryDisplay.workAreaSize.width, primaryDisplay.workAreaSize.height);

  mainwindow.setBounds({ x: config.x, y: config.y });
  notification.setAlwaysOnTop(config.alwaysOnTop);
  mainwindow.showInactive();

  //listeners          
  tray.on("click", () => mainwindow.show());

  ipcMain.handleOnce("setup-main-config", () => config);
  ipcMain.handleOnce("setup-main-counter", () => parseInt(fs.readFileSync(counter_path, "utf-8")));
  ipcMain.handleOnce("setup-main-env", () => ENV);
  ipcMain.handleOnce("setup-noti-config", () => config);

  ipcMain.on("hide-settings", () => mainwindow.hide());
  ipcMain.on("show-noti", () => notification.showInactive());

  ipcMain.on("save-config", (_, newConfigObject) => {
    notification.hide();

    for (const configKey in newConfigObject) {
      config[configKey] = newConfigObject[configKey];
    }

    notification.setAlwaysOnTop(config.alwaysOnTop);

    fs.writeFileSync(config_path, JSON.stringify(config, null, 4));

    notification.webContents.send("set-changes-from-main-to-noti", config);
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

  mainwindow.on("moved", () => {
    const { x, y } = mainwindow.getBounds();
    config.x = x;
    config.y = y;
    fs.writeFileSync(config_path, JSON.stringify(config, null, 4));
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
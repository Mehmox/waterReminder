const { app, ipcMain } = require('electron');
const winreg = require("winreg");
const fs = require("fs");
const path = require('path');
const ENV = require("./env.json").env;

const createTray = require("./tray");
const createWindow = require("./mainwindow");
const createNotification = require("./notification");

const config_path = path.join(app.getPath("userData"), "config.json");
const counter_path = path.join(app.getPath("userData"), "counter.txt");
let Logs = { ENV, getPath: app.getPath("exe"), isPacked: app.isPackaged };

app.whenReady().then(() => {
  //create          
  const tray = createTray(ENV === "production" ? path.join(__dirname, "assets", "water_drop.ico") : undefined);
  const mainwindow = createWindow();
  const notification = createNotification();

  mainwindow.show();

  //file       
  if (!fs.existsSync(counter_path)) fs.writeFileSync(counter_path, "0")

  let config
  if (fs.existsSync(config_path))
    config = JSON.parse(fs.readFileSync(config_path, "utf-8"))
  else {
    config = { alwaysOnTop: false, limit: 0, cup: 0, cooldown: 0, timeType: 1000, message: "" }

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

    mainwindow.show();
  }

  notification.setAlwaysOnTop(config.alwaysOnTop);
  notification.setSkipTaskbar(config.alwaysOnTop);

  //listeners          
  tray.on("click", () => mainwindow.show());

  ipcMain.handleOnce("setup-main-config", () => config);
  ipcMain.handleOnce("setup-main-counter", () => parseInt(fs.readFileSync(counter_path, "utf-8")));
  ipcMain.handle("setup-noti-config", () => config);


  ipcMain.on("hide-settings", () => mainwindow.hide());
  ipcMain.on("show-noti", () => {
    console.log("show inactive");
    notification.showInactive();
    console.log(notification.isFocused());
  });


  ipcMain.on("save-config", (event, config) => {
    notification.hide();
    console.log(config.alwaysOnTop)
    notification.setAlwaysOnTop(config.alwaysOnTop);
    notification.setSkipTaskbar(config.alwaysOnTop);

    fs.writeFileSync(config_path, JSON.stringify(config, null, 4));

    notification.webContents.send("set-changes-from-main-to-noti", config);
  });

  ipcMain.on("save-counter", (event, value) => {
    notification.hide();

    fs.writeFileSync(counter_path, value.toString());
  });

  ipcMain.on("hide-noti", async () => {
    notification.hide();

    let current = parseInt(fs.readFileSync(counter_path, "utf8"));
    current++

    fs.writeFileSync(counter_path, current.toString());

    mainwindow.webContents.send("ping-main-counter", current);
  });

  if (ENV !== "production") getAppInfo();

});

function getAppInfo() {
  const targetPath = path.join(app.getPath("userData"), "SystemLogs.json");
  let SystemLogs = {};

  if (fs.existsSync(targetPath)) {
    SystemLogs = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
  }

  SystemLogs[ENV] = Logs;

  fs.writeFileSync(targetPath, JSON.stringify(SystemLogs, null, 4));
}

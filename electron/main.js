const { app, ipcMain, screen } = require('electron');
const fs = require("fs");
const path = require('path');

const createWindow = require("./windows/mainwindow");
const createNotification = require("./windows/notification");
const createTray = require("./tray");
const get_config = require("./get_config");
const get_app_info = require("./get_app_info");

const ENV = process.env.NODE_ENV || require('../package.json').env.NODE_ENV;
const config_path = path.join(app.getPath("userData"), "config.json");
const counter_path = path.join(app.getPath("userData"), "counter.txt");

console.log(`NODE_ENV: ${ENV}`);

app.whenReady().then(() => {

  const { workAreaSize } = screen.getPrimaryDisplay();

  const config = get_config(app, counter_path, config_path, workAreaSize);
   
  //create           
  const mainwindow = createWindow(ENV);
  const notification = createNotification(ENV, workAreaSize.width, workAreaSize.height);
  const tray = createTray(ENV);

  mainwindow.setBounds({ x: config.x, y: config.y });
  notification.setAlwaysOnTop(config.alwaysOnTop);
  mainwindow.showInactive();
     
  //listeners          
  tray.on("click", () => mainwindow.show());
 
  ipcMain.handleOnce("setup-main-config", () => config);
  ipcMain.handleOnce("setup-main-counter", () => parseInt(fs.readFileSync(counter_path, "utf-8")));
  ipcMain.handleOnce("setup-main-env", () => ENV);
  ipcMain.handleOnce("setup-noti-config", () => config);
  ipcMain.handleOnce("setup-noti-counter", () => parseInt(fs.readFileSync(counter_path, "utf-8")));

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

  if (ENV !== "production") get_app_info();

});
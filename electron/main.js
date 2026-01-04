const { app, screen } = require('electron');
const fs = require("fs");
const path = require('path');

const get_config = require("./get_config");
const createWindow = require("./windows/mainwindow");
const createNotification = require("./windows/notification");
const createTray = require("./tray");
const mainlisteners = require("./listeners/mainlisteners");
const notilisteners = require("./listeners/notilisteners");

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

  let counter = parseInt(fs.readFileSync(counter_path, "utf-8"));

  mainlisteners(counter_path, config_path, config, counter, ENV, mainwindow, notification);
  notilisteners(counter_path, config, counter, mainwindow, notification);

});
const { Tray, Menu } = require('electron');
const path = require('path');

module.exports = function createTray(ENV) {

  const tray = new Tray(path.join(__dirname, "assets", ENV === "production" ? "water_drop.ico" : "settings.ico"));

  tray.setToolTip('Water-reminder');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', role: 'quit' }
  ]);

  tray.setContextMenu(contextMenu);

  return tray;
}

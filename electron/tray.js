const { Tray, Menu } = require('electron');
const path = require('path');

function createTray(tray_icon) {
  const tray = new Tray(tray_icon || path.join(__dirname, './assets/settings.ico'));

  tray.setToolTip('Water reminder');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', role: 'quit' }
  ]);

  tray.setContextMenu(contextMenu);

  return tray
}
module.exports = createTray

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
    setupNotiConfig: () => ipcRenderer.invoke("setup-noti-config"),
    setupNotiCounter: () => ipcRenderer.invoke("setup-noti-counter"),

    closeNotification: () => ipcRenderer.send("hide-noti"),

    changeConfig: (callback) => ipcRenderer.on("set-config-from-main-to-noti", (event, changes) => callback(changes)),
    changeCounter: (callback) => ipcRenderer.on("set-counter-from-main-to-noti", (event, changes) => callback(changes)),
});
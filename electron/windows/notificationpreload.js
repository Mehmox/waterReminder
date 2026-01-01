const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
    setupNotiConfig: () => ipcRenderer.invoke("setup-noti-config"),
    setupNotiCounter: () => ipcRenderer.invoke("setup-noti-counter"),

    closeNotification: () => ipcRenderer.send("hide-noti"),

    changeConfig: (callback) => ipcRenderer.on("set-changes-from-main-to-noti", (event, changes) => callback(changes)),
});
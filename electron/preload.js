const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
    setupMainConfig: () => ipcRenderer.invoke("setup-main-config"),
    setupMainCounter: () => ipcRenderer.invoke("setup-main-counter"),
    setupNotiConfig: () => ipcRenderer.invoke("setup-noti-config"),

    closeSettings: () => ipcRenderer.send("hide-settings"),
    showNoti: () => ipcRenderer.send("show-noti"),

    saveConfig: (config) => ipcRenderer.send("save-config", config),
    saveCounter: (counter) => ipcRenderer.send("save-counter", counter),

    closeNotification: () => ipcRenderer.send("hide-noti"),
    changeCounter: (callback) => ipcRenderer.on("ping-main-counter", (event, value) => callback(value)),

    changeConfig: (callback) => ipcRenderer.on("set-changes-from-main-to-noti", (event, changes) => callback(changes)),
});


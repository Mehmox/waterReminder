const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
    setupMainConfig: () => ipcRenderer.invoke("setup-main-config"),
    setupMainCounter: () => ipcRenderer.invoke("setup-main-counter"),
    setupMainEnv: () => ipcRenderer.invoke("setup-main-env"),

    closeSettings: () => ipcRenderer.send("hide-settings"),
    showNoti: () => ipcRenderer.send("show-noti"),

    saveConfig: (config) => ipcRenderer.send("save-config", config),
    saveCounter: (counter) => ipcRenderer.send("save-counter", counter),

    changeCounter: (callback) => ipcRenderer.on("ping-main-counter", (event, value) => callback(value)),
}); 
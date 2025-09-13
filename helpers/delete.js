const fs = require("fs");
const settingsPath = "C:/Users/Mehmox/AppData/Roaming/water-reminder/config.json"

if (fs.existsSync(settingsPath)) {
    fs.unlinkSync(settingsPath);
    console.log("config.json silindi.");
} else {
    console.log("config.json yok.");
}
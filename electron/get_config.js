const winreg = require("winreg");
const fs = require("fs");

const mainWidth = 450, mainHeight = 540;

module.exports = function get_config(app, counter_path, config_path, workAreaSize) {

    const Logs = { getPath: app.getPath("exe"), isPacked: app.isPackaged };
    let config;
   
    if (!fs.existsSync(counter_path)) fs.writeFileSync(counter_path, "0");

    if (fs.existsSync(config_path))

        config = JSON.parse(fs.readFileSync(config_path, "utf-8"));

    else {

        let x = workAreaSize.width / 2 - mainWidth / 2,
            y = workAreaSize.height / 2 - mainHeight / 2;

        config = { alwaysOnTop: false, limit: 0, cup: 0, cooldown: 0, timeType: 1000, x, y };

        fs.writeFileSync(config_path, JSON.stringify(config, null, 4));

        if (ENV === "production") {
            const regKey = new winreg({
                hive: winreg.HKCU,
                key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
            });

            regKey.set('Water-Reminder', winreg.REG_SZ, `"${Logs.getPath}"`, (err) => {
                if (err) Logs.regedit = err.message || "error";
                else Logs.regedit = "success";
            });
        }
    }

    return config;
}
module.exports = function get_app_info(ENV) {

    const targetPath = path.join(app.getPath("userData"), "SystemLogs.json");

    let SystemLogs = {};

    if (fs.existsSync(targetPath)) SystemLogs = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

    SystemLogs[ENV] = Logs;
    SystemLogs[ENV].date = new Date().toLocaleTimeString("tr-TR");

    fs.writeFileSync(targetPath, JSON.stringify(SystemLogs, null, 4));
    
}   
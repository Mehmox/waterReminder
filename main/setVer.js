const fs = require("fs");
const env = process.argv[2];

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const input = `REACT_APP_ENV=${env}
REACT_APP_VERSION = ${packageJson.version}`;

fs.writeFileSync("main/.env", input);
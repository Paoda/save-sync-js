const os = require('os');
const fs = require('fs');

class SettingsController {
  constructor() {
    this.appdir = this._getSettingsPath();
    this.slash = os.platform() === "win32" ? "\\" : "/";  

    const canLoadData = this.createPath();
  }

  createPath() {
    let existed = false; 

    this.path = this.appdir + this.slash + 'save-sync-js';
    this.pathFile = this.path + this.slash + 'settings.json';

     if (fs.existsSync(this.path)) {
       // Folder Exists. Check for Config file.
        if (!fs.existsSync(this.pathFile)) { //If it doesn't exist
          fs.writeFileSync(this.pathFile, JSON.stringify({}));
        } else existed = true;
     } else {
       // Folder doesn't exist. Create Folder and File.
       fs.mkdirSync(this.path);
       fs.writeFileSync(this.pathFile, JSON.stringify({}));
     }

     return existed;
  }

  get() {
    return JSON.parse(fs.readFileSync(this.pathFile));
  }

  save(obj) {
    fs.writeFileSync(this.pathFile, JSON.stringify(obj));
  }

  delete() {
    fs.unlinkSync(this.pathFile);
  }

  _getSettingsPath() {
    // MacOS, Linux and Windows Support
    let path;

    switch (os.platform()) {
      case "linux":
        if (process.env.XDG_DATA_HOME) path = process.XDG_DATA_HOME;
        else path = process.env.HOME + "/.local/share";
        break;
      case "darwin":
        path = process.env.HOME + "/Library/Application Suppport";
        break;
      case "win32":
        path = process.env.LOCALAPPDATA;
        break;
      default:
        path = null;
    }

    return path;
  }
}

module.exports = SettingsController;
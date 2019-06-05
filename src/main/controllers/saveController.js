const fs = require('fs');
const SettingsController = require('./settingsController');
const settings = new SettingsController();

class SaveController {
  constructor() {
    const canLoadData = this._createSavePath();

    this.trackedSaves = {};
    

    if (canLoadData) this.trackedSaves = this.getReferences();
    console.log(this.trackedSaves);
  }

  add(path) {
    // Add a save
    const clonePath = this.saveClonePath + settings.slash + this._generateUUID();
    this.trackedSaves[path] = {
      sourcePath: path,
      clonePath: clonePath + settings.slash + path.match(/\w+$/g)[0],
      lastUpdated: ~~(Date.now() / 1000)
    }

    // crawl and copy directories + their data structure to another directory
    // add a reference to the original, and it's duplicate in songs.json 

    fs.mkdirSync(clonePath);

    this._save(this.trackedSaves);
  }

  get(path) {
    // Get a save

    // get clone location of OG file path provided by user here.
    // return the relevant information
  }

  getReferences() {
    return JSON.parse(fs.readFileSync(this.saveCloneFile, { encoding: 'utf8' }));
  }

  update(path){
    // Update info about save

    // Similar to add but edites existing entries, rather than creates new ones
  }

  remove(path) {
    // Delete save

    // Deletes the clone folder, and then its reference in saves.json
  }

  _save(newTrackedSaves) {
    fs.writeFileSync(this.saveCloneFile, JSON.stringify(newTrackedSaves));

  }

  _crawl(path) {
    const path_lib = require('path');
    return new Promise((res, rej) => {
      let files = fs.readdir(path, (err, files) => {
        if (err) rej(err);

        Promise.all(files.map(file => {
          return new Promise((fres, frej) => {
            const fpath = path_lib.join(dir, file);
            fs.stat(fpath, (err, stat) => {
              if (err) frej(err);

              if (stat.isDirectory()) this._crawl(fpath).then(fres);
              else if (stat.isFile()) fres(fpath);
            })
          })
        }))
      })
    })
    
  }

  _generateUUID() {
    const digits = "0123456789abcdef";
    const generate = (num) => {
      let res = "";

      for (let i = 0; i < num; i++) res += digits.charAt(~~(Math.random() * digits.length));

      return res;
    }

    return `${generate(8)}-${generate(4)}-${generate(4)}-${generate(4)}-${generate(12)}`;
  }

  _createSavePath() {
    let existed = false;
    this.saveClonePath = settings.path + settings.slash + 'clone';
    this.saveCloneFile = settings.path + settings.slash + 'saves.json'
    if (!fs.existsSync(this.saveClonePath)) {
      fs.mkdirSync(this.saveClonePath);
      fs.writeFileSync(this.saveCloneFile, JSON.stringify({}));
    } else existed = true;

    return existed;
  }
}

module.exports = SaveController;

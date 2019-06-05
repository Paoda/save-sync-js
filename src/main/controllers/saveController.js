const fs = require('fs');
const path = require('path');
const SettingsController = require('./settingsController');
const settings = new SettingsController();

class SaveController {
  constructor() {
    const canLoadData = this._createSavePath();

    this.trackedSaves = null;

    if (canLoadData) this.trackedSaves = this.getReferences();
  }

  add(path) {
    // Add a save
    
    // crawl and copy directories + their data structure to another directory
    // add a reference to the original, and it's duplicate in songs.json 
  }

  get(path) {
    // Get a save

    // get clone location of OG file path provided by user here.
    // return the relevant information
  }

  getReferences() {
    const path = this.saveClonePath;
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

  _crawl(path) {
    return new Promise((res, rej) => {
      let files = fs.readdir(path, (err, files) => {
        if (err) rej(err);

        Promise.all(files.map(file => {
          return new Promise((fres, frej) => {
            const fpath = path.join(dir, file);
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

  _createSavePath() {
    let existed = false;
    this.saveClonePath = settings.appdir + settings.slash + 'saves';
    this.saveCloneFile = settings.appdir + settings.slash + 'saves.json'
    if (!fs.existsSync(this.saveClonePath)) {
      fs.mkdirSync(this.saveClonePath);
      fs.writeFileSync(this.saveCloneFile, JSON.stringify({}));
    } else existed = true;

    return existed;
  }
}

module.exports = SaveController;

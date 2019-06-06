const fs = require('fs');
const fse = require('fs-extra');
const SettingsController = require('./settingsController');
const settings = new SettingsController();

class SaveController {
  constructor() {
    const canLoadData = this._createSavePath();

    this.trackedSaves = {};
    if (canLoadData) this.trackedSaves = this.getReferences();
  }

  add(path) {
    // Add a save
    const cloneHome = this.saveClonePath + settings.slash + this._generateUUID();
    const copyRoot = cloneHome + settings.slash + path.match(/\w+$/g)[0]
    this.trackedSaves[path] = {
      sourcePath: path,
      cloneHome: cloneHome,
      clonePath: copyRoot,
      lastUpdated: ~~(Date.now() / 1000)
    }

    // crawl and copy directories + their data structure to another directory
    // add a reference to the original, and it's duplicate in songs.json 

    fs.mkdirSync(cloneHome); // Generate Location with UUID
    fs.mkdirSync(copyRoot); //Make sure Root Folder is there. 

    return new Promise((res, rej) => {
      fse.copy(path, copyRoot, { recursive: true }, err => {
        if (err) rej(err);
        this._save(this.trackedSaves);

        console.log(path + "has been backed up.")
        res();
      })
    })
  }

  getReferences() {
    return JSON.parse(fs.readFileSync(this.saveCloneFile, { encoding: 'utf8' }));
  }

  update(path, newPath){
    // Update info about save
    this.trackedSaves[path].sourcePath = newPath;
    this._save(this.trackedSaves);

  }

  sync(path) {
    return new Promise((res, rej) => {
      const ref = this.trackedSaves[path];
      this.trackedSaves[path].lastUpdated = ~~(Date.now() / 1000);

      fse.remove(ref.clonePath, err => {
        if (err) rej(err);

        fse.copy(ref.sourcePath, ref.clonePath, { overwrite: true, recursive: true }, err => {
          if (err) rej(err)
          console.log(ref.sourcePath + " has been synced.");
          res();

          this._save(this.trackedSaves)
        });
      });
    });
  }

  syncAll() {
    return new Promise((res, rej) => {
      for (let key in this.trackedSaves) {
        this.trackedSaves[key].lastUpdated = ~~(Date.now() / 1000);
        const ref = this.trackedSaves[key];

        if (this.trackedSaves.hasOwnProperty(key)) {
          fse.remove(ref.clonePath, err => {
            if (err) rej(err);

            fse.copy(ref.sourcePath, ref.clonePath, { overwrite: true, recursive: true}, err => {
              if (err) rej(err); 
              console.log(ref.sourcePath + " has been synced.");
              this._save(this.trackedSaves);
            });
          });
        }
      }
    });
  }

  remove(path) {
    // Delete save
    // Deletes the clone folder, and then its reference in saves.json
    
    return new Promise((res, rej) => {
      fse.remove(this.trackedSaves[path].clonePath, err => {
        if (err) rej(err);

        console.log("Deleted backup of " + path);
    
        this.trackedSaves[path] = undefined;
        this.trackedSaves = JSON.parse(JSON.stringify(this.trackedSaves));
        res();
      })
    })


    return new Promise((res, rej) => {
      fse.rmdir(this.trackedSaves[path].clonePath, err => {
        if (err) rej(err);

      })

    })
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

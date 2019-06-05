const fs = require('fs');
const SettingsController = require('./settingsController');
const settings = new SettingsController();



class SaveController {
  constructor() {
    const canLoadData = this._createSavePath();
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

  getAll() {
    // Get all save references
     
    // Essentially just return saves.json
  }

  update(path){
    // Update info about save

    // Similar to add but edites existing entries, rather than creates new ones
  }

  remove(path) {
    // Delete save

    // Deletes the clone folder, and then its reference in saves.json
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

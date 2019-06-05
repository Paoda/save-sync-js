const fs = require('fs');
const SettingsController = require('./settingsController');
const settings = new SettingsController();



class SaveController {
  constructor() {

  }

  add(path) {
    // Add a save
  }

  get(path) {
    // Get a save
  }

  getAll() {
    // Get All saves
  }

  update(path){
    // Update info about save
  }

  remove(path) {
    // Delete save
  }


  _createSavePath() {
    let existed = false;
    this.saveClonePath = settings.appdir + settings.slash + 'saves';

    if (!fs.existsSync(this.saveClonePath)) {
      fs.mkdirSync(this.saveClonePath)
    }
  }
}

module.exports = SaveController;

'use strict';
const Monitor = require('../monitor');
const monitor = new Monitor();

//Create modal for directories
class DirectoryModal extends Modal {
  constructor(reference) {
    super(reference);

    const SaveController = require('../main/controllers/saveController');
    this.saves = new SaveController();
  }

  //Get and display directories for pop up window
  getDirectories() {

    let trackedDirs = {};
    if (this.saves.canLoadData) trackedDirs = this.saves.getReferences();

    this.showDirectories(trackedDirs);
  }

  showDirectories(trackedDirs) {
    console.log(trackedDirs);

    for (let key in trackedDirs) {
      if (trackedDirs.hasOwnProperty(key)) {
        const table = document.querySelector('div.modal-background div#directories-list table');
        const row = document.createElement('tr');
        const tdLoc = document.createElement('td');
        tdLoc.innerHTML = trackedDirs[key].sourcePath;
    
        const tdTime = document.createElement('td');
        tdTime.innerHTML = trackedDirs[key].lastUpdated;
    
        row.appendChild(tdLoc);
        row.appendChild(tdTime);
        table.appendChild(row);
      }
    }
  }

  addDirectory(path) {
    this.saves.add(path);
  }

  removeDirectories(path) {
    this.saves.remove(path);
  }
}

//Create Settings modal
class SettingsModal extends Modal {
  constructor(reference) {
    super(reference);
    
  }
}

//Create and operate header buttons such as closing the program and minimizing
const createHeaderButtons = () =>  {
  const close = document.querySelector('header div.window-icons i.fa-window-close');
  const minimize = document.querySelector('header div.window-icons i.fa-window-minimize');
  const remote = require('electron').remote;

  close.onclick = () => {
    console.log("Close button clicked.");
    remote.app.quit();
  }

  minimize.onclick = () => {
    console.log("Minimize button clicked.");
    remote.BrowserWindow.getFocusedWindow().minimize()
    
  }
}

//Connect buttons to modals, and call to start monitor whem button is clicked
const connectButtons = () => {
  const monBtn = document.querySelector('button#monitor');
  const dirBtn = document.querySelector('button#directories');
  const settBtn = document.querySelector('button#settings');
  
  const dirModal = new DirectoryModal(document.querySelector('div.modal#directory-modal'));
  const settModal = new Modal(document.querySelector('div.modal#settings-modal'));

  monBtn.onclick = () => {
    console.log("Monitor Button Pressed.");

    if (monBtn.innerHTML === "Start Monitor") {
      monBtn.innerHTML = "Stop Monitor";
      monitor.run();
    } else {
      monBtn.innerHTML = "Start Monitor";
      monitor.stop();
    }
  }

  dirBtn.onclick = () => {
    console.log("Directory Button Pressed.");
    dirModal.toggle();
    dirModal.getDirectories();
  }


  settBtn.onclick = () => {
    console.log ("Settings Button Pressed");
    settModal.toggle();
  }
}

//Create header and connect buttons when program is loaded
document.addEventListener('DOMContentLoaded', () => {
  createHeaderButtons();
  connectButtons();
}, false)
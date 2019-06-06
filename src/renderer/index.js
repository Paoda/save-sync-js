'use strict';
const Monitor = require('../monitor');
const monitor = new Monitor();

class DirectoryModal extends Modal {
  constructor(reference) {
    super(reference);

    const SaveController = require('../main/controllers/saveController');
    this.saves = new SaveController();

  }

  getDirectories() {
    let trackedDirs = {};
    if (this.saves.canLoadData) trackedDirs = this.saves.getReferences();

    return trackedDirs;
  }

  showDirectories() {
    
  }

  addDirectories() {

  }

  removeDirectories() {

  }
}

class SettingsModal extends Modal {
  constructor(reference) {
    super(reference);
  }



}


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
  }


  settBtn.onclick = () => {
    console.log ("Settings Button Pressed");
    settModal.toggle();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createHeaderButtons();
  connectButtons();
}, false)
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

  //Get display directories for popup window
  getDirectories() {

    let trackedDirs = {};
    if (this.saves.canLoadData) trackedDirs = this.saves.getReferences();

    this.showDirectories(trackedDirs);
  }

  // Display directories from .getDirectories
  showDirectories(trackedDirs) {
    const createHeader = (table) => {

        // First Delete Everything
        while(table.firstChild) table.removeChild(table.firstChild);
  
        const row = document.createElement('tr');
        const thLoc = document.createElement('th');
        thLoc.innerHTML = "Location";
  
        const thTime = document.createElement('th');
        thTime.innerHTML = "Last Updated";
  
        row.appendChild(thLoc);
        row.appendChild(thTime);
  
        table.appendChild(row);
    }

    const table = document.querySelector('div.modal-background div#directories-list table');
    createHeader(table);

    // loop through object
    for (let key in trackedDirs) {
      if (trackedDirs.hasOwnProperty(key)) {
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

  async addDirectory(path) {
    await this.saves.add(path);
  }

  async removeDirectories(path) {
    await this.saves.remove(path);
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
  
  const addBtn = document.querySelector('div.modal-background button#dir-input-add');
  const rmBtn = document.querySelector('div.modal-background button#dir-input-remove');

  const dirModal = new DirectoryModal(document.querySelector('div.modal#directory-modal'));

  addBtn.onclick = () => {
    const text = document.querySelector('div.modal-background div#user-input input.modal-text').value;
    dirModal.addDirectory(text).then(() => dirModal.getDirectories());
  }

  rmBtn.onclick = () => {
    const text = document.querySelector('div.modal-background div#user-input input.modal-text').value;
    dirModal.removeDirectories(text).then(() => dirModal.getDirectories());
  }

  monBtn.onclick = () => {
    console.log("Monitor Button Pressed.");

    if (monBtn.innerHTML === "Start Monitor") {
      monBtn.innerHTML = "Stop Monitor";
      monitor.run();
    } else {
      monitor.stop("UI Interrupt").then(() => monBtn.innerHTML = "Start Monitor");
    }
  }

  dirBtn.onclick = () => {
    console.log("Directory Button Pressed.");
    dirModal.toggle();
    dirModal.getDirectories();
  }

  settBtn.onclick = () => {
    console.log ("Settings Button Pressed");
    const modal = new Modal(document.querySelector('div.modal#settings-modal'));

    modal.toggle();
  }
}

//Create header and connect buttons when program is loaded
document.addEventListener('DOMContentLoaded', () => {
  createHeaderButtons();
  connectButtons();
}, false)
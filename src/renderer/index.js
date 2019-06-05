'use strict';

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
  const monitorBtn = document.querySelector('div.button#monitor');
  const directoryBtn = document.querySelector('div.button#directories');
  const settingsBtn = document.querySelector('div.button#settings');

  console.log(monitorBtn);
  console.log(directoryBtn);
  console.log(settingsBtn);

}

const connectModals = () => {
  const documentModal = new Modal(document.querySelector('div.modal#directory-modal'));
  const settingsModal = new Modal(document.querySelector('div.modal#settings-modal'));


  console.log(documentModal);
  console.log(settingsModal);
}






document.addEventListener('DOMContentLoaded', () => {
  createHeaderButtons();
  connectModals();
}, false)

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

const createBodyButtons = () => {
  const monitorBtn = document.querySelector();
  const dirBtn = document.querySelector();
  const settingsBtn = document.querySelector();
}

document.addEventListener('DOMContentLoaded', () => {
  createHeaderButtons();
}, false)
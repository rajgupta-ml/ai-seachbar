console.log('Preload script is loading!'); // <--- Add this
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendButtonClick: (message) => ipcRenderer.send('button-clicked', message),
});
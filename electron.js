const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const {GoogleGenAI} = require("@google/genai");
const isDev = require('electron-is-dev'); // Import electron-is-dev

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 80, // Initial height
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    show: false, // Initially hidden
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true, 
      preload: `${__dirname}/preload.js`
    }
  });
  
  
  // Determine the URL to load based on development or production environment
  const startURL = isDev
  ? 'http://localhost:5173' // In development, load from Vite's dev server
  : `file://${path.join(__dirname, './frontend/dist/index.html')}`; // In production, load the built file
  
  mainWindow.loadURL(startURL); // Use loadURL for external URLs
  
  
  mainWindow.on('blur', () => {
    // Before hiding, check if dev tools are focused
    if (mainWindow && !mainWindow.webContents.isDevToolsFocused()) {
      mainWindow.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  
  globalShortcut.register('CommandOrControl+K', () => {
    
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.center(); // Recenter before showing
      mainWindow.show();
      mainWindow.focus();
    }
  });
  
  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
console.log( new GoogleGenAI());


ipcMain.on("button-clicked", (event, message) => {
  console.log(`Message from React:`, message);
})

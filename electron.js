const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const {GoogleGenAI} = require("@google/genai");
const isDev = require('electron-is-dev'); // Import electron-is-dev

let mainWindow;;
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


ipcMain.on("button-clicked", (event, message) => {
  console.log(`Message from React:`, message);

})

ipcMain.on("start-generating-stream", async (event, message) => {
  const ai = new GoogleGenAI({apiKey : ""})

  try {
    
      const response = await ai.models.generateContentStream({
        "model" : "gemini-2.5-flash",
        "contents" : message,
      })
    
      for await (const chunk of response) {
        const chunkText = chunk.text;
        console.log(chunkText);
          if (chunkText) {
            console.log('Main Process: Sending chunk:', chunkText);
            event.sender.send('ai-text-chunk', chunkText);
          }
      }
    
      event.sender.send('ai-stream-end');
      console.log('Main Process: AI stream finished.');
  } catch (error) {
    console.error('Main Process: Error during streaming AI generation:', error);
    // Send an error message or signal to the renderer
    event.sender.send('ai-stream-error', `Error generating text: ${error.message || String(error)}`);
    event.sender.send('ai-stream-end'); // Ensure stream end is signaled even on error  
  }



})

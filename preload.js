// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Existing function
  sendButtonClick: (message) => ipcRenderer.send('button-clicked', message),

  // NEW: Function to start the streaming generation
  startGenerateStream: (prompt) => ipcRenderer.send('start-generating-stream', prompt),

  // NEW: Function to register a callback for incoming text chunks
  // ENSURE THIS IS SPELLED CORRECTLY AS 'onAiTextChunk' (with an 'n')
  onAiTextChunk: (callback) => {
    const handler = (event, chunk) => callback(chunk);
    ipcRenderer.on('ai-text-chunk', handler);
    // Return a function to remove the listener for cleanup
    return () => ipcRenderer.removeListener('ai-text-chunk', handler);
  },

  // NEW: Function to register a callback for stream end
  onAiStreamEnd: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('ai-stream-end', handler);
    return () => ipcRenderer.removeListener('ai-stream-end', handler);
  },

  // NEW: Function to register a callback for stream errors
  onAiStreamError: (callback) => {
    const handler = (event, errorMsg) => callback(errorMsg);
    ipcRenderer.on('ai-stream-error', handler);
    return () => ipcRenderer.removeListener('ai-stream-error', handler);
  }
});

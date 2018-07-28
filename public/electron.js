const electron =require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = require('electron').ipcMain
const isDev=require('electron-is-dev')
const path=require('path')


let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, height: 780, resizable: true, webPreferences: {
            webSecurity: false,
        }
    })
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
    mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


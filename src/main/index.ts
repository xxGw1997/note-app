import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { createNote, deleteNote, getNotes, readNote, writeNote } from './lib'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { CREATE_NOTE, DELETE_NOTE, GET_NOTES, READ_NOTE, WRITE_NOTE } from '@shared/ipc-event'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'Note',
    frame: true,
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  /* Electron issues 39959 */
	/* Electron27.0.3 On win11, Electron 28.0.0 on Win10 22H2 X64*/
	/* Temporary solution: Modify window size when the window is focused or blurred */
	/* (Whether modifying the height or the width, the page content may shake, please choose according to your needs) */
	
	/* Using Electron26.6.2 may not have this issue. For me, this bug may not appear.*/
	/* Electron26.6.2 cannot click through the transparent area */
	/* Electron27.0.3 and 28.0.0 can click through the transparent area */
	
	if (/^(27|28)\.\d+\.\d+(\-alpha\.\d+|\-beta\.\d+)?$/.test(process.versions.electron) && process.platform === "win32") {
		mainWindow.on("blur", () => {
			const[width_39959, height_39959] = mainWindow.getSize();
			mainWindow.setSize(width_39959, height_39959 + 1);
			mainWindow.setSize(width_39959, height_39959);
		});
		mainWindow.on("focus", () => {
			const[width_39959, height_39959] = mainWindow.getSize();
			mainWindow.setSize(width_39959, height_39959 + 1);
			mainWindow.setSize(width_39959, height_39959);
		});
	}


  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  // ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle(GET_NOTES, (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle(READ_NOTE, (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle(WRITE_NOTE, (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle(CREATE_NOTE, (_, ...args: Parameters<CreateNote>) => createNote(...args))
  ipcMain.handle(DELETE_NOTE, (_, ...args: Parameters<DeleteNote>) => deleteNote(...args))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

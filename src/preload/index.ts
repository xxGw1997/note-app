import { contextBridge, ipcRenderer } from 'electron'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { CREATE_NOTE, DELETE_NOTE, GET_NOTES, READ_NOTE, WRITE_NOTE } from '@shared/ipc-event'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BroswerWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke(GET_NOTES, ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke(READ_NOTE, ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke(WRITE_NOTE, ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke(CREATE_NOTE, ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke(DELETE_NOTE, ...args)
  })
} catch (error) {
  console.error('Error: ', error)
}

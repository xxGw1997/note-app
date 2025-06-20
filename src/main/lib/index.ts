import { homedir } from 'os'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import path from 'path'
import { isEmpty } from 'lodash'

import welcomeNoteFile from '../../../resources/welcome-note.md?asset'

import { APP_DIR_NAME, FILE_ENCODING, WELCOME_NOTE_FILENAME } from '@shared/constants'
import { CreateNote, DeleteNote, GetNotes, NoteInfo, ReadNote, WriteNote } from '@shared/types'

export const getRootDir = () => `${homedir()}\\${APP_DIR_NAME}`

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFilenames = await readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const notes = notesFilenames.filter((filename) => filename.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('No notes found, creating a welcome note.')

    const content = await readFile(welcomeNoteFile, { encoding: FILE_ENCODING })

    await writeFile(`${rootDir}\\${WELCOME_NOTE_FILENAME}`, content, { encoding: FILE_ENCODING })

    notes.push(WELCOME_NOTE_FILENAME)
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}\\${filename}`)
  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}\\${filename}.md`, { encoding: FILE_ENCODING })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()
  return writeFile(`${rootDir}\\${filename}.md`, content, { encoding: FILE_ENCODING })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  console.log('rootDir', rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}\\Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('Note creation canceled')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be saved under ${rootDir}. Avoid using other directories!`
    })
    return false
  }

  console.info(`Creating note: ${filePath}`)
  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Note delete canceled.')
    return false
  }

  console.info(`Delete note: ${filename}`)

  await remove(`${rootDir}\\${filename}.md`)
  return true
}

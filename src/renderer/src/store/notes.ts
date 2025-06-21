import { create } from 'zustand'
import { isNumber } from 'lodash'

import { NoteInfo } from '@shared/types'
// import { noteMocks } from './mocks'

interface NotesState {
  notes: NoteInfo[]
  selectedNoteIndex: number | null
  setSelectedNoteIndex: (index: number) => void
  createEmptyNote: () => Promise<void>
  removeNote: () => void
  getNoteFromOs: () => Promise<void>
  writeNoteToOs: (content: string) => Promise<void>
}

const loadNotesFromOs = async () => {
  const notes = await window.context.getNotes()
  if (!notes) return []

  // sort by lastest updatedTime
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNoteIndex: null,
  setSelectedNoteIndex: async (index) => {
    const notes = get().notes
    const selectedNote = notes[index]
    const noteContent = await window.context.readNote(selectedNote.title)
    set(() => ({
      selectedNoteIndex: index,
      notes: notes.map((note, i) => {
        if (index === i) {
          return {
            ...note,
            content: noteContent
          }
        } else {
          return note
        }
      })
    }))
  },
  createEmptyNote: async () => {
    const title = await window.context.createNote('')
    if (!title) return

    set((state) => {
      const notes = state.notes
      const newNote: NoteInfo = {
        title,
        lastEditTime: Date.now(),
        content: ''
      }

      return {
        notes: [newNote, ...notes],
        selectedNoteIndex: 0
      }
    })
  },
  removeNote: async () => {
    const notes = get().notes
    const selectedNoteIndex = get().selectedNoteIndex
    if (!notes || !isNumber(selectedNoteIndex)) return
    const selectedNote = notes[selectedNoteIndex]
    if (!selectedNote) return

    const ok = await window.context.deleteNote(selectedNote.title)
    if (!ok) return

    set(({ notes, selectedNoteIndex }) => {
      return {
        notes: notes.filter((_, i) => selectedNoteIndex !== i),
        selectedNoteIndex: null
      }
    })
  },
  getNoteFromOs: async () => {
    const curNotes = get().notes
    if (curNotes && curNotes.length > 0) return
    const notes = await loadNotesFromOs()
    set(() => ({
      notes
    }))
  },
  writeNoteToOs: async (content) => {
    const notes = get().notes
    const selectedNoteIndex = get().selectedNoteIndex
    if (!notes || !isNumber(selectedNoteIndex)) return
    const selectedNote = notes[selectedNoteIndex]
    if (!selectedNote) return
    // 1、 save content to os disk
    await window.context.writeNote(selectedNote.title, content)
    // 2、 update edit note last edited time
    set(() => ({
      notes: notes.map((note, i) =>
        i === selectedNoteIndex ? { ...note, lastEditTime: Date.now() } : note
      )
    }))
  }
}))

export const useSelectedNote = () =>
  useNotesStore((state) => {
    if (state.selectedNoteIndex === null) return null
    return state.notes[state.selectedNoteIndex]
  })

import { useNotesList } from '@/hooks/useNotesList'

import NotePreview from './note-preview'
import { useNotesStore } from '@/store/notes'
import { useEffect } from 'react'

const NotePreviewList = ({ onSelect }: { onSelect: () => void }) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({ onSelect })
  const getNotes = useNotesStore((state) => state.getNoteFromOs)

  useEffect(() => {
    getNotes()
  }, [getNotes])

  if (!notes) return null

  if (notes.length === 0) {
    return (
      <ul className="text-center pt-4">
        <span>No Note Yet ~</span>
      </ul>
    )
  }

  return (
    <ul className="mt-3 space-y-1">
      {notes.map((note, i) => (
        <NotePreview
          key={note.title + i}
          isActive={selectedNoteIndex === i}
          onClick={() => handleNoteSelect(i)}
          {...note}
        />
      ))}
    </ul>
  )
}

export default NotePreviewList

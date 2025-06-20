import { useNotesStore } from '@/store/notes'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const { notes, selectedNoteIndex, setSelectedNoteIndex } = useNotesStore()

  const handleNoteSelect = (index: number) => {
    setSelectedNoteIndex(index)
    onSelect && onSelect()
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect
  }
}

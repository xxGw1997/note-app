import { useRef } from 'react'
import { throttle } from 'lodash'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { NoteContent } from '@shared/types'

import { useNotesStore, useSelectedNote } from '@/store/notes'
import { AUTO_SAVING_TIME } from '@shared/constants'

export const useMDXEditor = () => {
  const editorRef = useRef<MDXEditorMethods>(null)

  const selectedNote = useSelectedNote()
  const saveNote = useNotesStore((state) => state.writeNoteToOs)

  const handleAutoSaving = throttle(
    async (content: NoteContent) => {
      if (!selectedNote) return
      await saveNote(content)
    },
    AUTO_SAVING_TIME,
    {
      leading: false,
      trailing: true
    }
  )

  const handleBlur = async () => {
    if (!selectedNote) return

    //先取消已经在列队中的throlle
    handleAutoSaving.cancel()

    const content = editorRef.current?.getMarkdown()

    if (content !== null && content !== undefined) {
      await saveNote(content)
    }
  }

  return {
    editorRef,
    selectedNote,
    handleAutoSaving,
    handleBlur
  }
}

import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { useSelectedNote } from '@/store/notes'

const FloatingNoteTitle = ({ children, className, ...props }: ComponentProps<'div'>) => {
  const selectedNote = useSelectedNote()

  if (!selectedNote) return null

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <span className="text-gray-400">{selectedNote.title}</span>
    </div>
  )
}

export default FloatingNoteTitle

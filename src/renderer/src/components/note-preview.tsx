import { cn, formatDate } from '@renderer/lib/utils'
import { NoteInfo } from '@shared/types'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

const NotePreview = ({
  title,
  content,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: NotePreviewProps) => {
  return (
    <div
      className={cn(
        'cursor-pointer px-2.5 py-3 rounded-md transition-colors duration-75',
        {
          'bg-zinc-400/75': isActive,
          'hover:bg-zinc-500/75': !isActive
        },
        className
      )}
      {...props}
    >
      <h3 className="mb-1 font-bold truncate">{title}</h3>
      <span className="inline-block w-full mb-2 text-xs font-light text-left">{formatDate(lastEditTime)}</span>
    </div>
  )
}

export default NotePreview

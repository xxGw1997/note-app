export type NoteInfo = {
  title: string
  lastEditTime: number
  content?: string
}

export type NoteContent = string

export type GetNotes = () => Promise<NoteInfo[]>

export type ReadNote = (title: NoteInfo['title']) => Promise<NoteContent>

export type WriteNote = (title: NoteInfo['title'], content: NoteContent) => Promise<void>

export type CreateNote = (title: NoteInfo['title']) => Promise<string | false>

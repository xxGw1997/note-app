import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin
} from '@mdxeditor/editor'

import { cn } from '@/lib/utils'

import { useTheme } from './theme-provider'
import { useMDXEditor } from '@/hooks/useMDXEditor'

const MDXEditorContainer = () => {
  const { theme } = useTheme()
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMDXEditor()

  if (!selectedNote) return null

  return (
    <MDXEditor
      ref={editorRef}
      key={selectedNote.title}
      markdown={selectedNote.content ?? ''}
      onChange={handleAutoSaving}
      onBlur={handleBlur}
      className={cn('max-w-none rounded-sm caret-green-500', theme === 'dark' ? '!dark-theme' : '')}
      contentEditableClassName="prose dark:prose-invert outline-none min-h-screen max-w-none text-lg px-8 py-5 prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
      plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), markdownShortcutPlugin()]}
    />
  )
}

export default MDXEditorContainer

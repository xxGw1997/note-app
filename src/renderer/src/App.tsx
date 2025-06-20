import { Container, Content, RootLayout, Sidebar, DraggableTopBar } from './components/layout'
import ActionButtonsRow from './components/action-buttons-row'
import NotePreviewList from './components/note-preview-list'
import MDXEditorContainer from './components/mdx-editor'
import { ThemeProvider } from './components/theme-provider'
import FloatingNoteTitle from './components/floating-note-title'
import { useRef } from 'react'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui.theme">
      <Container className="text-primary">
        <DraggableTopBar />
        <RootLayout>
          <Sidebar className="bg-background/30 p-2">
            <ActionButtonsRow />
            <NotePreviewList onSelect={resetScroll} />
          </Sidebar>
          <Content ref={contentContainerRef} className="bg-background/50 border-l border-white/20">
            <FloatingNoteTitle className="pt-2" />
            <MDXEditorContainer />
          </Content>
        </RootLayout>
      </Container>
    </ThemeProvider>
  )
}

export default App

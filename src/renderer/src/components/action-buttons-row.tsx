import { FileSignatureIcon, Trash2Icon } from 'lucide-react'

import { useNotesStore } from '@/store/notes'

import { Button } from './ui/button'
import ThemeSwitch from './theme-switch'
import { useConfirm } from '@/hooks/use-confirm'

const ActionButtonsRow = () => {
  const createEmptyNote = useNotesStore((state) => state.createEmptyNote)
  const removeNote = useNotesStore((state) => state.removeNote)
  const [ConfirmDialog, confirm] = useConfirm({
    title: '确定要删除吗？',
    message: '此操作将会永久删除此文件!',
  })

  const handleRemove = async () => {
    const ok = await confirm()
    if (!ok) return
    removeNote()
  }

  return (
    <div className="flex justify-between mt-1">
      <div>
        <ConfirmDialog />
        <Button variant="ghost" size="icon" onClick={createEmptyNote}>
          <FileSignatureIcon className="w-4 h-4" />
        </Button>
        <ThemeSwitch />
      </div>
      <Button className="hover:text-destructive" variant="ghost" size="icon" onClick={handleRemove}>
        <Trash2Icon />
      </Button>
    </div>
  )
}

export default ActionButtonsRow

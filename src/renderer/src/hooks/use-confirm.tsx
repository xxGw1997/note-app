import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { JSX, useState } from 'react'

type UseConfirmProps = {
  title: string
  message: string
  confirmVariant?: 'destructive' | 'default'
}

type UseConfirmReturnType = [() => JSX.Element, () => Promise<unknown>]

export const useConfirm = ({
  title,
  message,
  confirmVariant = 'destructive'
}: UseConfirmProps): UseConfirmReturnType => {
  const [promise, setPromise] = useState<{ resolve: (v: boolean) => void } | null>(null)

  const handleOpen = (open: boolean) => {
    if (!open) setPromise(null)
  }

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve })
    })

  const handleClose = () => {
    setPromise(null)
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const confirmDialog = () => {
    return (
      <Dialog open={promise !== null} onOpenChange={handleOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button onClick={handleCancel} variant="outline">
              取消
            </Button>
            <Button onClick={handleConfirm} variant={confirmVariant}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [confirmDialog, confirm]
}

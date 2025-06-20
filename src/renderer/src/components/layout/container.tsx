import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const Container = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={cn('bg-background/90', className)} {...props}>
      {children}
    </div>
  )
}

import { cn } from '@renderer/lib/utils'
import { ComponentProps, forwardRef } from 'react'

export const RootLayout = ({ className, children, ...props }: ComponentProps<'main'>) => {
  return (
    <main className={cn('flex flex-row h-screen', className)} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside className={cn('w-[250px] mt-8 h-[100vh + 10px] overflow-auto', className)} {...props}>
      {children}
    </aside>
  )
}

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex-1 overflow-auto', className)} {...props}>
        {children}
      </div>
    )
  }
)
Content.displayName = 'Content'

import { cn } from '@/lib/utils'
import type { Priority } from '@/lib/analyze-chat'

const styles: Record<Priority, { label: string; className: string }> = {
  high: {
    label: 'High',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
  },
  medium: {
    label: 'Medium',
    className:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  },
  low: {
    label: 'Low',
    className: 'border-border bg-muted text-muted-foreground',
  },
}

export function PriorityTag({ priority }: { priority: Priority }) {
  const { label, className } = styles[priority]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      <span className="sr-only">Priority: </span>
      {label}
    </span>
  )
}

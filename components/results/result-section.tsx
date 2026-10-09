import type { LucideIcon } from 'lucide-react'
import type { ResultItem } from '@/lib/mock-analysis'
import { PriorityTag } from './priority-tag'

type ResultSectionProps = {
  id: string
  title: string
  icon: LucideIcon
  items: ResultItem[]
  emptyText: string
}

export function ResultSection({ id, title, icon: Icon, items, emptyText }: ResultSectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col rounded-2xl border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-5">
        <h3 id={id} className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          {title}
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </header>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground sm:px-5">{emptyText}</p>
      ) : (
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-1.5 px-4 py-3 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate text-sm font-medium">{item.sender}</span>
                  <time className="shrink-0 font-mono text-xs text-muted-foreground">
                    {item.time}
                  </time>
                </div>
                <PriorityTag priority={item.priority} />
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

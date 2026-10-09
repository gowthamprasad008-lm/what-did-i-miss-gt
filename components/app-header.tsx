import { ShieldCheck } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          What Did I Miss?
        </h1>
        <p className="text-pretty text-sm text-muted-foreground sm:text-base">
          Paste a group chat and get the parts that actually matter to you.
        </p>
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        100% local - your chats never leave this device
      </span>
    </header>
  )
}

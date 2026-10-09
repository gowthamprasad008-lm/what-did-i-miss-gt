import { AtSign, CalendarClock, CheckCircle2, ListTodo, MessageSquareText } from 'lucide-react'
import type { AnalysisResult } from '@/lib/analyze-chat'
import { ResultSection } from './result-section'
import { SummaryCard } from './summary-card'

type ResultsAreaProps = {
  result: AnalysisResult | null
}

export function ResultsArea({ result }: ResultsAreaProps) {
  if (!result) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-12 text-center">
        <MessageSquareText className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">No results yet</p>
        <p className="max-w-sm text-pretty text-sm text-muted-foreground">
          Paste a chat or upload a .txt export, add your name, then hit Analyze.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <SummaryCard result={result} />
      <div className="grid gap-4 md:grid-cols-2">
        <ResultSection
          id="mentions-heading"
          title="Mentions of you"
          icon={AtSign}
          items={result.mentions}
          emptyText="Nobody mentioned you."
        />
        <ResultSection
          id="deadlines-heading"
          title="Deadlines"
          icon={CalendarClock}
          items={result.deadlines}
          emptyText="No deadlines found."
        />
        <ResultSection
          id="decisions-heading"
          title="Decisions"
          icon={CheckCircle2}
          items={result.decisions}
          emptyText="No decisions were made."
        />
        <ResultSection
          id="actions-heading"
          title="Action items"
          icon={ListTodo}
          items={result.actionItems}
          emptyText="No action items found."
        />
      </div>
    </div>
  )
}

import type { AnalysisResult } from '@/lib/analyze-chat'

type SummaryCardProps = {
  result: AnalysisResult
}

export function SummaryCard({ result }: SummaryCardProps) {
  const stats = [
    { label: 'Messages', value: result.stats.messages },
    { label: 'People', value: result.stats.participants },
    { label: 'High priority', value: result.stats.highPriority },
    { label: 'Time span', value: result.stats.timeSpan },
  ]

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-2xl border bg-foreground p-5 text-background shadow-sm sm:p-6"
    >
      <h2 id="summary-heading" className="text-xs font-medium uppercase tracking-wider opacity-60">
        Summary
      </h2>
      <p className="mt-2 text-pretty text-base leading-relaxed sm:text-lg">{result.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-background/15 pt-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <dt className="text-xs opacity-60">{stat.label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

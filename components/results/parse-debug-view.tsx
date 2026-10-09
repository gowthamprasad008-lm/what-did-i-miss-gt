import type { ParsedMessage } from '@/lib/parse-chat'

type ParseDebugViewProps = {
  messages: ParsedMessage[] | null
}

export function ParseDebugView({ messages }: ParseDebugViewProps) {
  if (!messages) return null

  const preview = messages.slice(0, 3)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-dashed bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Parser debug
        </h2>
        <p className="text-sm">
          <span className="text-2xl font-semibold tabular-nums">{messages.length}</span>{' '}
          <span className="text-muted-foreground">
            parsed {messages.length === 1 ? 'message' : 'messages'}
          </span>
        </p>
      </div>

      {preview.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No messages matched. Expected lines like{' '}
          <code className="font-mono text-foreground">{'[09:05] Name: message'}</code> or{' '}
          <code className="font-mono text-foreground">{'21/03/2026, 09:05 - Name: message'}</code>.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {preview.map((message, index) => (
            <li key={index} className="rounded-xl bg-muted/60 p-3 font-mono text-xs leading-relaxed">
              <div className="flex gap-3 text-muted-foreground">
                <span>#{index + 1}</span>
                <span>
                  sender: <span className="text-foreground">{message.sender}</span>
                </span>
                <span>
                  time: <span className="text-foreground">{message.time}</span>
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-foreground">{message.text}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

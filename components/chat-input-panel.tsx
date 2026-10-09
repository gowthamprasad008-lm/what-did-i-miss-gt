'use client'

import { useRef } from 'react'
import { FileText, Loader2, Sparkles, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatInputPanelProps = {
  chat: string
  name: string
  isAnalyzing: boolean
  onChatChange: (value: string) => void
  onNameChange: (value: string) => void
  onLoadSample: () => void
  onAnalyze: () => void
}

export function ChatInputPanel({
  chat,
  name,
  isAnalyzing,
  onChatChange,
  onNameChange,
  onLoadSample,
  onAnalyze,
}: ChatInputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    onChatChange(await file.text())
    event.target.value = ''
  }

  return (
    <section
      aria-labelledby="input-heading"
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 id="input-heading" className="sr-only">
        Chat input
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="chat" className="text-sm font-medium">
              Chat transcript
            </label>
            <button
              type="button"
              onClick={onLoadSample}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Use sample chat
            </button>
          </div>
          <textarea
            id="chat"
            value={chat}
            onChange={(e) => onChatChange(e.target.value)}
            placeholder={'[09:05] Marcus: @Alex can you send the deck by Thursday?\n[09:08] Priya: Final decision - we go with blue.'}
            rows={9}
            className="min-h-48 w-full resize-y rounded-xl border bg-background px-3.5 py-3 font-mono text-sm leading-relaxed outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5" aria-hidden="true" />
              {chat.trim() ? `${chat.split('\n').filter(Boolean).length} lines` : 'Nothing pasted yet'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileChange}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload aria-hidden="true" />
              Upload .txt
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Alex"
              autoComplete="given-name"
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <Button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing || !chat.trim()}
            className="h-10 px-5 sm:w-auto"
          >
            {isAnalyzing ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </Button>
        </div>
      </div>
    </section>
  )
}

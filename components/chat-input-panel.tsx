'use client'

import { useRef } from 'react'
import { AlertCircle, FileText, Sparkles, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { readChatFile } from '@/lib/validate-upload'

export type InputError = {
  field: 'chat' | 'name' | 'upload'
  message: string
}

type ChatInputPanelProps = {
  chat: string
  name: string
  error: InputError | null
  onChatChange: (value: string) => void
  onNameChange: (value: string) => void
  onUploadError: (message: string) => void
  onLoadSample: () => void
  onAnalyze: () => void
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}

const fieldClass =
  'w-full border bg-background outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20'

export function ChatInputPanel({
  chat,
  name,
  error,
  onChatChange,
  onNameChange,
  onUploadError,
  onLoadSample,
  onAnalyze,
}: ChatInputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatError = error && (error.field === 'chat' || error.field === 'upload') ? error : null
  const nameError = error?.field === 'name' ? error : null

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const upload = await readChatFile(file)
    if (upload.ok) onChatChange(upload.text)
    else onUploadError(upload.error)
  }

  const lineCount = chat.trim() ? chat.split('\n').filter((line) => line.trim()).length : 0

  return (
    <section
      aria-labelledby="input-heading"
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 id="input-heading" className="sr-only">
        Chat input
      </h2>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onAnalyze()
        }}
        className="flex flex-col gap-4"
      >
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
            autoComplete="off"
            spellCheck={false}
            aria-invalid={chatError ? true : undefined}
            aria-describedby={chatError ? 'chat-error' : undefined}
            className={`${fieldClass} min-h-48 resize-y rounded-xl px-3.5 py-3 font-mono text-sm leading-relaxed`}
          />
          {chatError && <FieldError id="chat-error" message={chatError.message} />}
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5" aria-hidden="true" />
              {lineCount > 0 ? `${lineCount} lines` : 'Nothing pasted yet'}
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
              <span className="sr-only"> (max 2 MB)</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
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
              autoComplete="off"
              spellCheck={false}
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? 'name-error' : undefined}
              className={`${fieldClass} h-10 rounded-lg px-3 text-sm`}
            />
            {nameError && <FieldError id="name-error" message={nameError.message} />}
          </div>
          <Button type="submit" className="h-10 px-5 sm:mt-7 sm:w-auto">
            <Sparkles aria-hidden="true" />
            Analyze
          </Button>
        </div>
      </form>
    </section>
  )
}

'use client'

import { useRef, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ChatInputPanel, type InputError } from '@/components/chat-input-panel'
import { ResultsArea } from '@/components/results/results-area'
import { analyzeChat, type AnalysisResult } from '@/lib/analyze-chat'
import { parseChat } from '@/lib/parse-chat'
import { SAMPLE_CHAT } from '@/lib/sample-chat'

export function WhatDidIMiss() {
  const [chat, setChat] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<InputError | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const resultsRef = useRef<HTMLElement>(null)

  function handleChatChange(value: string) {
    setChat(value)
    if (error?.field === 'chat' || error?.field === 'upload') setError(null)
  }

  function handleNameChange(value: string) {
    setName(value)
    if (error?.field === 'name') setError(null)
  }

  function handleLoadSample() {
    handleChatChange(SAMPLE_CHAT)
    if (!name) setName('Alex')
  }

  function handleAnalyze() {
    if (!chat.trim()) {
      setResult(null)
      setError({ field: 'chat', message: 'Paste a chat or upload a .txt file first.' })
      return
    }

    if (!name.trim()) {
      setResult(null)
      setError({ field: 'name', message: 'Enter your name so we can find messages that mention you.' })
      return
    }

    const messages = parseChat(chat)
    if (messages.length === 0) {
      setResult(null)
      setError({
        field: 'chat',
        message:
          'No chat messages found. Each message should start like "[09:05] Name: …" or a WhatsApp export line like "20/10/2026, 09:05 - Name: …".',
      })
      return
    }

    setError(null)
    setResult(analyzeChat(messages, name))
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12">
      <AppHeader />
      <ChatInputPanel
        chat={chat}
        name={name}
        error={error}
        onChatChange={handleChatChange}
        onNameChange={handleNameChange}
        onUploadError={(message) => setError({ field: 'upload', message })}
        onLoadSample={handleLoadSample}
        onAnalyze={handleAnalyze}
      />
      <section ref={resultsRef} aria-label="Results" aria-live="polite" className="scroll-mt-6">
        <ResultsArea result={result} />
      </section>
    </main>
  )
}

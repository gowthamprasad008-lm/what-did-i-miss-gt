'use client'

import { useRef, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ChatInputPanel } from '@/components/chat-input-panel'
import { ParseDebugView } from '@/components/results/parse-debug-view'
import { SAMPLE_CHAT } from '@/lib/mock-analysis'
import { parseChat, type ParsedMessage } from '@/lib/parse-chat'

export function WhatDidIMiss() {
  const [chat, setChat] = useState('')
  const [name, setName] = useState('')
  const [parsed, setParsed] = useState<ParsedMessage[] | null>(null)
  const resultsRef = useRef<HTMLElement>(null)

  function handleLoadSample() {
    setChat(SAMPLE_CHAT)
    if (!name) setName('Alex')
  }

  function handleAnalyze() {
    setParsed(parseChat(chat))
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
        isAnalyzing={false}
        onChatChange={setChat}
        onNameChange={setName}
        onLoadSample={handleLoadSample}
        onAnalyze={handleAnalyze}
      />
      <section ref={resultsRef} aria-label="Results" aria-live="polite" className="scroll-mt-6">
        <ParseDebugView messages={parsed} />
      </section>
    </main>
  )
}

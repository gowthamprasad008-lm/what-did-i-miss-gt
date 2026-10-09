'use client'

import { useRef, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ChatInputPanel } from '@/components/chat-input-panel'
import { ResultsArea } from '@/components/results/results-area'
import { getMockAnalysis, SAMPLE_CHAT, type AnalysisResult } from '@/lib/mock-analysis'

export function WhatDidIMiss() {
  const [chat, setChat] = useState('')
  const [name, setName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const resultsRef = useRef<HTMLElement>(null)

  function handleLoadSample() {
    setChat(SAMPLE_CHAT)
    if (!name) setName('Alex')
  }

  function handleAnalyze() {
    setIsAnalyzing(true)
    setTimeout(() => {
      setResult(getMockAnalysis(name))
      setIsAnalyzing(false)
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 700)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12">
      <AppHeader />
      <ChatInputPanel
        chat={chat}
        name={name}
        isAnalyzing={isAnalyzing}
        onChatChange={setChat}
        onNameChange={setName}
        onLoadSample={handleLoadSample}
        onAnalyze={handleAnalyze}
      />
      <section ref={resultsRef} aria-label="Results" aria-live="polite" className="scroll-mt-6">
        <ResultsArea result={result} />
      </section>
    </main>
  )
}

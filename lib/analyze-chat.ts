import type { ParsedMessage } from '@/lib/parse-chat'
import {
  ACTION_PHRASES,
  DEADLINE_WORDS,
  DECISION_PHRASES,
  MONTHS,
  POINTS,
  PRIORITY_THRESHOLDS,
  RECENT_FRACTION,
  TIME_PATTERNS,
  WEEKDAYS,
} from '@/lib/rules'

export type Priority = 'high' | 'medium' | 'low'

export type ResultItem = {
  id: string
  sender: string
  time: string
  message: string
  priority: Priority
  score: number
}

export type AnalysisResult = {
  summary: string
  stats: {
    messages: number
    participants: number
    highPriority: number
    timeSpan: string
  }
  mentions: ResultItem[]
  deadlines: ResultItem[]
  decisions: ResultItem[]
  actionItems: ResultItem[]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Longest phrases first so the alternation never stops at a shorter prefix. */
function alternation(phrases: string[]) {
  return [...phrases]
    .sort((a, b) => b.length - a.length)
    .map((phrase) => escapeRegExp(phrase).replace(/'/g, "['\u2019]"))
    .join('|')
}

function phrasePattern(phrases: string[]) {
  return new RegExp(`\\b(?:${alternation(phrases)})\\b`, 'i')
}

const WEEKDAY = `(?:${alternation(WEEKDAYS)})`
const MONTH = `(?:${alternation(MONTHS)})`

const DEADLINE_PATTERNS = [
  phrasePattern(DEADLINE_WORDS),
  new RegExp(`\\bby\\s+${WEEKDAY}\\b`, 'i'),
  ...TIME_PATTERNS,
  new RegExp(`\\b${MONTH}\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?\\b`, 'i'),
  new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+${MONTH}\\b`, 'i'),
]

const ACTION_PATTERN = phrasePattern(ACTION_PHRASES)
const DECISION_PATTERN = phrasePattern(DECISION_PHRASES)

function buildNamePattern(name: string): RegExp | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  // Lookarounds instead of \b so names with punctuation (e.g. "J.R.") still match on edges.
  return new RegExp(`(?<![\\p{L}\\p{N}_])@?${escapeRegExp(trimmed)}(?![\\p{L}\\p{N}_])`, 'iu')
}

function toPriority(score: number): Priority {
  if (score >= PRIORITY_THRESHOLDS.high) return 'high'
  if (score >= PRIORITY_THRESHOLDS.medium) return 'medium'
  return 'low'
}

function byScoreThenTime(a: ScoredMessage, b: ScoredMessage) {
  return b.score - a.score || a.index - b.index
}

function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

function truncate(text: string, max = 90) {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat
}

function joinList(parts: string[]) {
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

type ScoredMessage = {
  index: number
  message: ParsedMessage
  score: number
  isMention: boolean
  isDeadline: boolean
  isDecision: boolean
  isAction: boolean
}

function toResultItem(scored: ScoredMessage): ResultItem {
  return {
    id: `msg-${scored.index}`,
    sender: scored.message.sender,
    time: scored.message.time,
    message: scored.message.text,
    priority: toPriority(scored.score),
    score: scored.score,
  }
}

function buildSummary(
  messages: ParsedMessage[],
  participants: number,
  name: string,
  counts: { mentions: number; deadlines: number; decisions: number; actionItems: number },
  top: ScoredMessage[],
) {
  if (messages.length === 0) {
    return 'No messages could be read. Make sure each line starts with "[HH:MM] Name:" or a WhatsApp timestamp like "20/10/2026, 09:05 - Name:".'
  }

  const sentences: string[] = [
    `Analyzed ${plural(messages.length, 'message')} from ${plural(participants, 'person', 'people')}.`,
  ]

  const who = name.trim()
  if (who) {
    sentences.push(
      counts.mentions > 0
        ? `${who} was mentioned ${plural(counts.mentions, 'time')}.`
        : `Nobody mentioned ${who}.`,
    )
  }

  const found = [
    counts.deadlines > 0 && plural(counts.deadlines, 'deadline'),
    counts.decisions > 0 && plural(counts.decisions, 'decision'),
    counts.actionItems > 0 && plural(counts.actionItems, 'action item'),
  ].filter((part): part is string => Boolean(part))

  sentences.push(found.length > 0 ? `Found ${joinList(found)}.` : 'No deadlines, decisions, or action items found.')

  const highlights = top.filter((item) => item.score > 0)
  if (highlights.length > 0) {
    const quoted = highlights.map(
      (item) => `${item.message.sender} at ${item.message.time}: "${truncate(item.message.text)}"`,
    )
    sentences.push(`Most important: ${quoted.join(' — then ')}`)
  }

  return sentences.join(' ')
}

export function analyzeChat(messages: ParsedMessage[], name: string): AnalysisResult {
  const namePattern = buildNamePattern(name)
  const recentStart = messages.length - Math.ceil(messages.length * RECENT_FRACTION)

  const scored: ScoredMessage[] = messages.map((message, index) => {
    const text = message.text
    const isMention = namePattern ? namePattern.test(text) : false
    const isDeadline = DEADLINE_PATTERNS.some((pattern) => pattern.test(text))
    const isQuestion = text.trimEnd().endsWith('?')
    const isAction = ACTION_PATTERN.test(text)
    const isDecision = DECISION_PATTERN.test(text)
    const isRecent = index >= recentStart

    const score =
      (isMention ? POINTS.mention : 0) +
      (isDeadline ? POINTS.deadline : 0) +
      (isQuestion || isAction ? POINTS.questionOrRequest : 0) +
      (isDecision ? POINTS.decision : 0) +
      (isRecent ? POINTS.recent : 0)

    return { index, message, score, isMention, isDeadline, isDecision, isAction }
  })

  const section = (predicate: (item: ScoredMessage) => boolean) =>
    scored.filter(predicate).sort(byScoreThenTime).map(toResultItem)

  const mentions = section((item) => item.isMention)
  const deadlines = section((item) => item.isDeadline)
  const decisions = section((item) => item.isDecision)
  const actionItems = section((item) => item.isAction)

  const participants = new Set(messages.map((message) => message.sender.toLowerCase())).size
  const timeSpan =
    messages.length > 0 ? `${messages[0].time} – ${messages[messages.length - 1].time}` : '—'

  const sectionedIds = new Set(
    [...mentions, ...deadlines, ...decisions, ...actionItems].map((item) => item.id),
  )
  const highPriority = scored.filter(
    (item) => sectionedIds.has(`msg-${item.index}`) && toPriority(item.score) === 'high',
  ).length

  const top = [...scored].sort(byScoreThenTime).slice(0, 2)

  return {
    summary: buildSummary(
      messages,
      participants,
      name,
      {
        mentions: mentions.length,
        deadlines: deadlines.length,
        decisions: decisions.length,
        actionItems: actionItems.length,
      },
      top,
    ),
    stats: { messages: messages.length, participants, highPriority, timeSpan },
    mentions,
    deadlines,
    decisions,
    actionItems,
  }
}

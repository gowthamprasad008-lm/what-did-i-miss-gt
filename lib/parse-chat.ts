export type ParsedMessage = {
  sender: string
  time: string
  text: string
}

// [HH:MM] Name: message
const BRACKET_LINE = /^\[(\d{1,2}:\d{2})\]\s*(.*)$/

// DD/MM/YYYY, HH:MM - Name: message
const WHATSAPP_LINE = /^\d{1,2}\/\d{1,2}\/\d{2,4},\s*(\d{1,2}:\d{2})\s*-\s*(.*)$/

// "Name: message" — sender ends at the first colon followed by a space (or end of line).
const SENDER_AND_TEXT = /^([^:]+?):(?:\s(.*))?$/

// Invisible direction marks and BOMs that WhatsApp exports sprinkle into lines.
const INVISIBLE_CHARS = /[\u200e\u200f\u202a-\u202e\ufeff]/g

function matchHeader(line: string): { time: string; rest: string } | null {
  const match = BRACKET_LINE.exec(line) ?? WHATSAPP_LINE.exec(line)
  if (!match) return null
  return { time: match[1].padStart(5, '0'), rest: match[2] }
}

export function parseChat(raw: string): ParsedMessage[] {
  const messages: ParsedMessage[] = []
  let current: ParsedMessage | null = null

  for (const rawLine of raw.replace(INVISIBLE_CHARS, '').split(/\r?\n/)) {
    const line = rawLine.trimEnd()
    const header = matchHeader(line.trimStart())

    if (!header) {
      // Continuation of a multi-line message. Lines before the first message are dropped.
      if (current) current.text += `\n${line}`
      continue
    }

    const senderMatch = SENDER_AND_TEXT.exec(header.rest)
    if (!senderMatch) {
      // System line (e.g. "Priya joined", "Messages are end-to-end encrypted").
      // Stop attaching continuation lines to the previous message.
      current = null
      continue
    }

    current = {
      sender: senderMatch[1].trim(),
      time: header.time,
      text: senderMatch[2] ?? '',
    }
    messages.push(current)
  }

  for (const message of messages) {
    message.text = message.text.trim()
  }

  return messages
}

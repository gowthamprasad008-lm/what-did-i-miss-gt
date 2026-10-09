export type Priority = 'high' | 'medium' | 'low'

export type ResultItem = {
  id: string
  sender: string
  time: string
  message: string
  priority: Priority
}

export type AnalysisResult = {
  summary: string
  stats: {
    messages: number
    participants: number
    timeSpan: string
  }
  mentions: ResultItem[]
  deadlines: ResultItem[]
  decisions: ResultItem[]
  actionItems: ResultItem[]
}

export const SAMPLE_CHAT = `[09:02] Priya: Morning all! Quick sync on the launch
[09:05] Marcus: @Alex can you send the final deck by Thursday EOD?
[09:07] Jordan: We agreed to go with the blue pricing page, right?
[09:08] Priya: Yes, blue it is. Final decision.
[09:15] Marcus: Reminder: QA sign-off is due Friday 3pm
[09:21] Jordan: Alex, are you still joining the client call tomorrow?
[09:40] Priya: I'll book the venue for the offsite
[10:02] Marcus: Launch moved to Oct 20 - please update your calendars
[10:10] Jordan: Can someone review PR #482 before lunch?`

export function getMockAnalysis(name: string): AnalysisResult {
  const you = name.trim() || 'you'

  return {
    summary: `The team finalized the blue pricing page and pushed the launch to Oct 20. ${you} was asked to send the final deck by Thursday and confirm attendance on tomorrow's client call. QA sign-off is due Friday afternoon.`,
    stats: {
      messages: 9,
      participants: 3,
      timeSpan: '09:02 – 10:10',
    },
    mentions: [
      {
        id: 'm1',
        sender: 'Marcus',
        time: '09:05',
        message: `@${you} can you send the final deck by Thursday EOD?`,
        priority: 'high',
      },
      {
        id: 'm2',
        sender: 'Jordan',
        time: '09:21',
        message: `${you}, are you still joining the client call tomorrow?`,
        priority: 'medium',
      },
    ],
    deadlines: [
      {
        id: 'd1',
        sender: 'Marcus',
        time: '09:05',
        message: 'Final deck due Thursday EOD',
        priority: 'high',
      },
      {
        id: 'd2',
        sender: 'Marcus',
        time: '09:15',
        message: 'QA sign-off is due Friday 3pm',
        priority: 'high',
      },
      {
        id: 'd3',
        sender: 'Marcus',
        time: '10:02',
        message: 'Launch moved to Oct 20 - please update your calendars',
        priority: 'medium',
      },
    ],
    decisions: [
      {
        id: 'x1',
        sender: 'Priya',
        time: '09:08',
        message: 'Yes, blue it is. Final decision.',
        priority: 'medium',
      },
      {
        id: 'x2',
        sender: 'Marcus',
        time: '10:02',
        message: 'Launch date moved to Oct 20',
        priority: 'high',
      },
    ],
    actionItems: [
      {
        id: 'a1',
        sender: 'Marcus',
        time: '09:05',
        message: `${you}: send the final deck`,
        priority: 'high',
      },
      {
        id: 'a2',
        sender: 'Jordan',
        time: '10:10',
        message: 'Review PR #482 before lunch',
        priority: 'medium',
      },
      {
        id: 'a3',
        sender: 'Priya',
        time: '09:40',
        message: "I'll book the venue for the offsite",
        priority: 'low',
      },
    ],
  }
}

/**
 * All scoring rules for the analyzer live here.
 *
 * Phrases are matched case-insensitively as whole words. A straight apostrophe
 * (') in a phrase also matches a curly one (’), so "i'll" matches "I’ll".
 */

export const POINTS = {
  /** Message contains your name or @name. */
  mention: 3,
  /** Message contains a deadline word, time, or date. */
  deadline: 3,
  /** Message ends with "?" or contains a request/commitment phrase. */
  questionOrRequest: 2,
  /** Message contains a decision word. */
  decision: 3,
  /** Message is in the most recent part of the chat. */
  recent: 1,
} as const

/** Minimum score for each priority. Anything below `medium` is Low. */
export const PRIORITY_THRESHOLDS = {
  high: 5,
  medium: 3,
} as const

/** Share of the chat (from the end) that counts as "recent". */
export const RECENT_FRACTION = 0.25

/** Single words that signal a deadline. */
export const DEADLINE_WORDS = ['today', 'tomorrow', 'tonight', 'eod', 'asap', 'due', 'deadline']

/** "by" followed by any of these signals a deadline, e.g. "by Friday". */
export const WEEKDAYS = [
  'monday', 'mon',
  'tuesday', 'tues', 'tue',
  'wednesday', 'wed',
  'thursday', 'thurs', 'thur', 'thu',
  'friday', 'fri',
  'saturday', 'sat',
  'sunday', 'sun',
]

/** A month next to a day number signals a deadline, e.g. "Oct 20" or "20 October". */
export const MONTHS = [
  'january', 'jan',
  'february', 'feb',
  'march', 'mar',
  'april', 'apr',
  'may',
  'june', 'jun',
  'july', 'jul',
  'august', 'aug',
  'september', 'sept', 'sep',
  'october', 'oct',
  'november', 'nov',
  'december', 'dec',
]

/** Times inside the message text that signal a deadline. */
export const TIME_PATTERNS = [
  /** 12-hour clock: "3pm", "3 pm", "10:30am". */
  /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/i,
  /** 24-hour clock: "15:00". The line's own timestamp is stripped by the parser first. */
  /(?<![\d:])(?:[01]?\d|2[0-3]):[0-5]\d(?![\d:])/,
]

/** Requests or commitments. These make a message an Action item. */
export const ACTION_PHRASES = [
  'can you',
  'could you',
  'can someone',
  'please',
  'need to',
  'need you to',
  "i'll",
  'i will',
  'make sure',
  "don't forget",
]

/** Decisions or changes of plan. These make a message a Decision. */
export const DECISION_PHRASES = [
  'decided',
  'final decision',
  'agreed',
  'we go with',
  "let's go with",
  'lets go with',
  'finalized',
  'finalised',
  'approved',
  'moved to',
  'postponed',
  'rescheduled',
  'cancelled',
  'canceled',
]

export const DND_DICE = [4, 6, 8, 10, 12, 20, 100] as const

export type DieSides = (typeof DND_DICE)[number]

export type RollMode = 'normal' | 'advantage' | 'disadvantage'

export interface ParsedNotation {
  count: number
  sides: number
  modifier: number
}

export interface RollResult {
  notation: string
  sides: number
  rolls: number[]
  modifier: number
  total: number
  label: string
  mode: RollMode
  isNat20: boolean
  isNat1: boolean
  timestamp: number
}

const NOTATION_RE = /^(\d*)d(\d+)([+-]\d+)?$/i

export function parseNotation(input: string): ParsedNotation | null {
  const trimmed = input.trim().toLowerCase().replace(/\s/g, '')
  const match = trimmed.match(NOTATION_RE)
  if (!match) return null

  const count = match[1] === '' ? 1 : parseInt(match[1], 10)
  const sides = parseInt(match[2], 10)
  const modifier = match[3] ? parseInt(match[3], 10) : 0

  if (count < 1 || count > 100 || sides < 2 || sides > 1000) return null
  return { count, sides, modifier }
}

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides))
}

export function formatNotation(count: number, sides: number, modifier: number): string {
  const base = `${count}d${sides}`
  if (modifier === 0) return base
  return modifier > 0 ? `${base}+${modifier}` : `${base}${modifier}`
}

export function rollNotation(
  notation: string,
  options: { mode?: RollMode; label?: string } = {},
): RollResult | null {
  const parsed = parseNotation(notation)
  if (!parsed) return null

  const mode = options.mode ?? 'normal'
  const { count, sides, modifier } = parsed

  let rolls: number[]
  let sum: number
  if (sides === 20 && count === 1 && (mode === 'advantage' || mode === 'disadvantage')) {
    const a = rollDie(20)
    const b = rollDie(20)
    rolls = [a, b]
    sum = mode === 'advantage' ? Math.max(a, b) : Math.min(a, b)
  } else {
    rolls = rollDice(count, sides)
    sum = rolls.reduce((a, b) => a + b, 0)
  }

  const total = sum + modifier
  const kept = mode === 'advantage' || mode === 'disadvantage' ? sum : null
  const isNat20 = sides === 20 && (kept !== null ? kept === 20 : rolls.some((r) => r === 20))
  const isNat1 = sides === 20 && (kept !== null ? kept === 1 : rolls.some((r) => r === 1))

  return {
    notation: formatNotation(count, sides, modifier),
    sides,
    rolls,
    modifier,
    total,
    label: options.label ?? formatNotation(count, sides, modifier),
    mode,
    isNat20,
    isNat1,
    timestamp: Date.now(),
  }
}

export function keptRollIndex(result: RollResult): number | null {
  if (result.mode === 'advantage') {
    return result.rolls.indexOf(Math.max(...result.rolls))
  }
  if (result.mode === 'disadvantage') {
    return result.rolls.indexOf(Math.min(...result.rolls))
  }
  return null
}

export function dieLabel(sides: number): string {
  const labels: Record<number, string> = {
    4: 'd4 — Caltrops, daggers',
    6: 'd6 — Shortsword, fireball',
    8: 'd8 — Longsword',
    10: 'd10 — Heavy crossbow',
    12: 'd12 — Greataxe',
    20: 'd20 — Attacks & saves',
    100: 'd100 — Percentile',
  }
  return labels[sides] ?? `d${sides}`
}

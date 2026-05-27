import type { DieSides, RollMode, RollResult } from '~/utils/dice'
import { DND_DICE, parseNotation, rollNotation } from '~/utils/dice'

const MAX_HISTORY = 20

export function useDiceRoller() {
  const customNotation = ref('1d20')
  const modifier = ref(0)
  const rollMode = ref<RollMode>('normal')
  const lastResult = ref<RollResult | null>(null)
  const history = ref<RollResult[]>([])
  const error = ref<string | null>(null)
  const isRolling = ref(false)

  function addToHistory(result: RollResult) {
    history.value = [result, ...history.value].slice(0, MAX_HISTORY)
    lastResult.value = result
  }

  async function animateRoll() {
    isRolling.value = true
    await new Promise((r) => setTimeout(r, 280))
    isRolling.value = false
  }

  async function rollCustom() {
    error.value = null
    const mod = modifier.value
    const base = customNotation.value.trim().toLowerCase()
    const withMod =
      mod === 0 ? base : base.includes('+') || base.includes('-') ? base : `${base}${mod > 0 ? `+${mod}` : mod}`

    const parsed = parseNotation(withMod)
    if (!parsed) {
      error.value = 'Invalid notation. Try formats like 2d6+3 or 1d20.'
      return
    }

    await animateRoll()
    const result = rollNotation(withMod, { mode: rollMode.value, label: 'Custom roll' })
    if (result) addToHistory(result)
  }

  async function rollQuick(sides: DieSides) {
    error.value = null
    const mod = modifier.value
    const notation = mod === 0 ? `1d${sides}` : `1d${sides}${mod > 0 ? `+${mod}` : mod}`

    await animateRoll()
    const result = rollNotation(notation, {
      mode: sides === 20 ? rollMode.value : 'normal',
      label: `d${sides}`,
    })
    if (result) addToHistory(result)
  }

  function clearHistory() {
    history.value = []
    lastResult.value = null
  }

  return {
    DND_DICE,
    customNotation,
    modifier,
    rollMode,
    lastResult,
    history,
    error,
    isRolling,
    rollCustom,
    rollQuick,
    clearHistory,
  }
}

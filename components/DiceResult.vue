<script setup lang="ts">
import type { RollResult } from '~/utils/dice'
import { keptRollIndex } from '~/utils/dice'

const props = defineProps<{
  result: RollResult | null
  isRolling: boolean
}>()

const breakdown = computed(() => {
  if (!props.result) return ''
  const { rolls, modifier, mode, total } = props.result
  let rollStr: string
  if (mode === 'advantage' || mode === 'disadvantage') {
    const kept = mode === 'advantage' ? Math.max(...rolls) : Math.min(...rolls)
    rollStr = rolls.map((r) => (r === kept ? `${r}★` : String(r))).join(', ')
  } else {
    rollStr = rolls.join(' + ')
  }
  const modStr = modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''
  const modeStr =
    mode === 'advantage' ? ' · advantage' : mode === 'disadvantage' ? ' · disadvantage' : ''
  const eq = modifier !== 0 || rolls.length > 1 ? ` = ${total}` : ''
  return `[${rollStr}]${modStr}${modeStr}${eq}`
})

const keptIdx = computed(() => (props.result ? keptRollIndex(props.result) : null))

const diceToShow = computed(() => {
  if (!props.result) return []
  const { rolls, sides } = props.result
  const maxVisible = 12
  const visible = rolls.slice(0, maxVisible)
  return visible.map((value, index) => ({
    value,
    index,
    sides,
    kept: keptIdx.value === index,
    discarded: keptIdx.value !== null && keptIdx.value !== index,
  }))
})

const overflowCount = computed(() => {
  if (!props.result) return 0
  return Math.max(0, props.result.rolls.length - 12)
})
</script>

<template>
  <section class="panel result-panel">
    <h2 class="panel-title">Last roll</h2>
    <div class="result-display">
      <template v-if="result">
        <div v-if="diceToShow.length" class="dice-showcase" :class="{ rolling: isRolling }">
          <DieVisual
            v-for="die in diceToShow"
            :key="`${result.timestamp}-${die.index}`"
            :sides="die.sides"
            :value="isRolling ? null : die.value"
            size="lg"
            :kept="die.kept"
            :discarded="die.discarded"
            :rolling="isRolling"
          />
          <span v-if="overflowCount" class="dice-overflow">+{{ overflowCount }} more</span>
        </div>

        <div
          class="result-total"
          :class="{
            rolling: isRolling,
            nat20: result.isNat20 && !isRolling,
            nat1: result.isNat1 && !isRolling,
          }"
        >
          {{ isRolling ? '…' : result.total }}
        </div>
        <p class="result-breakdown">
          <strong>{{ result.label }}</strong>
          · {{ breakdown }}
        </p>
        <span v-if="result.isNat20" class="result-badge crit">Natural 20!</span>
        <span v-else-if="result.isNat1" class="result-badge fail">Natural 1!</span>
        <span
          v-else-if="result.mode === 'advantage'"
          class="result-badge adv"
        >Advantage</span>
        <span
          v-else-if="result.mode === 'disadvantage'"
          class="result-badge adv"
        >Disadvantage</span>
      </template>
      <p v-else class="result-breakdown">Roll the dice to begin your adventure.</p>
    </div>
  </section>
</template>

<style scoped>
.dice-showcase {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  min-height: 7.5rem;
}

.dice-overflow {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-family: 'Cinzel', serif;
}
</style>

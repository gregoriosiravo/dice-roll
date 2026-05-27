<script setup lang="ts">
import type { RollMode } from '~/utils/dice'

const customNotation = defineModel<string>('notation', { required: true })
const modifier = defineModel<number>('modifier', { required: true })
const rollMode = defineModel<RollMode>('mode', { required: true })

defineProps<{
  disabled?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  roll: []
}>()

const modes: { value: RollMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'advantage', label: 'Advantage' },
  { value: 'disadvantage', label: 'Disadvantage' },
]
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">Custom roll</h2>
    <div class="custom-row">
      <input
        v-model="customNotation"
        type="text"
        placeholder="e.g. 2d6+3, 1d20, 4d6"
        aria-label="Dice notation"
        @keydown.enter="emit('roll')"
      />
    </div>
    <div class="modifier-row">
      <label>Modifier</label>
      <div class="modifier-controls">
        <button type="button" aria-label="Decrease modifier" @click="modifier--">−</button>
        <span>{{ modifier >= 0 ? `+${modifier}` : modifier }}</span>
        <button type="button" aria-label="Increase modifier" @click="modifier++">+</button>
      </div>
    </div>
    <div class="mode-row">
      <button
        v-for="m in modes"
        :key="m.value"
        type="button"
        class="mode-btn"
        :class="{ active: rollMode === m.value }"
        @click="rollMode = m.value"
      >
        {{ m.label }}
      </button>
    </div>
    <p class="result-breakdown" style="margin-top: 0.75rem; text-align: left">
      Advantage & disadvantage apply to <strong>1d20</strong> rolls only.
    </p>
    <button type="button" class="roll-btn" :disabled="disabled" @click="emit('roll')">
      Roll dice
    </button>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </section>
</template>

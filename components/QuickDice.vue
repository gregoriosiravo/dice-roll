<script setup lang="ts">
import { dieLabel } from '~/utils/dice'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  roll: [sides: number]
}>()

const dice = [
  { sides: 4, hint: 'Damage' },
  { sides: 6, hint: 'Spells' },
  { sides: 8, hint: 'Weapons' },
  { sides: 10, hint: 'Weapons' },
  { sides: 12, hint: 'Big hits' },
  { sides: 20, hint: 'Checks' },
  { sides: 100, hint: 'Tables' },
] as const
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">Quick dice</h2>
    <div class="dice-grid">
      <button
        v-for="die in dice"
        :key="die.sides"
        type="button"
        class="dice-btn"
        :title="dieLabel(die.sides)"
        :disabled="disabled"
        @click="emit('roll', die.sides)"
      >
        <DieVisual :sides="die.sides" size="sm" />
        <span class="die-hint">{{ die.hint }}</span>
      </button>
    </div>
  </section>
</template>

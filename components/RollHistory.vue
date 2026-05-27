<script setup lang="ts">
import type { RollResult } from '~/utils/dice'

defineProps<{
  history: RollResult[]
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <section v-if="history.length" class="panel">
    <h2 class="panel-title">Roll history</h2>
    <ul class="history-list">
      <li v-for="(entry, i) in history" :key="entry.timestamp + '-' + i">
        <span class="history-roll">{{ entry.label }} · [{{ entry.rolls.join(', ') }}]</span>
        <span class="history-total">{{ entry.total }}</span>
      </li>
    </ul>
    <button type="button" class="history-clear" @click="emit('clear')">Clear history</button>
  </section>
</template>

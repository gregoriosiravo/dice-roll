<script setup lang="ts">
import type { DieSides } from '~/utils/dice'

const {
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
} = useDiceRoller()

function onQuickRoll(sides: number) {
  rollQuick(sides as DieSides)
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>D&amp;D Dice Roller</h1>
      <p>Roll polyhedral dice for attacks, saves, damage, and tables.</p>
    </header>

    <DiceResult :result="lastResult" :is-rolling="isRolling" />
    <QuickDice :disabled="isRolling" @roll="onQuickRoll" />
    <CustomRoll
      v-model:notation="customNotation"
      v-model:modifier="modifier"
      v-model:mode="rollMode"
      :disabled="isRolling"
      :error="error"
      @roll="rollCustom"
    />

    <section class="panel">
      <h2 class="panel-title">D&amp;D quick reference</h2>
      <ul class="help-list">
        <li><strong>d20</strong> — Attack rolls, ability checks, saving throws</li>
        <li><strong>Advantage</strong> — Roll 2d20, keep the higher (e.g. hidden attacker)</li>
        <li><strong>Disadvantage</strong> — Roll 2d20, keep the lower (e.g. attacking in darkness)</li>
        <li><strong>2d6, 1d8, etc.</strong> — Weapon and spell damage from your character sheet</li>
        <li><strong>4d6 drop lowest</strong> — Enter <code>4d6</code> and ignore the lowest die when rolling stats</li>
        <li><strong>d100</strong> — Percentile rolls for random tables</li>
      </ul>
    </section>

    <RollHistory :history="history" @clear="clearHistory" />

    <footer class="footer">
      <p>Built for tabletop D&amp;D players · <a href="https://github.com/sirap95/dice-roll" target="_blank" rel="noopener">GitHub</a></p>
    </footer>
  </div>
</template>

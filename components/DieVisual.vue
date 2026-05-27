<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    sides: number
    value?: number | null
    size?: 'sm' | 'md' | 'lg'
    kept?: boolean
    discarded?: boolean
    rolling?: boolean
    showLabel?: boolean
  }>(),
  {
    value: null,
    size: 'md',
    kept: false,
    discarded: false,
    rolling: false,
    showLabel: false,
  },
)

const uid = useId()

const sizeMap = { sm: 52, md: 88, lg: 120 }
const px = computed(() => sizeMap[props.size])

const palette = computed(() => {
  const sets: Record<number, { fill: string; edge: string; face: string; glow: string }> = {
    4: { fill: '#6b1f2a', edge: '#c43c4e', face: '#2a1218', glow: 'rgba(196, 60, 78, 0.45)' },
    6: { fill: '#8b4513', edge: '#d4a017', face: '#3d2410', glow: 'rgba(212, 160, 23, 0.4)' },
    8: { fill: '#1e4d3a', edge: '#3d9970', face: '#0f2419', glow: 'rgba(61, 153, 112, 0.4)' },
    10: { fill: '#1a3a5c', edge: '#4a90c2', face: '#0d1e30', glow: 'rgba(74, 144, 194, 0.4)' },
    12: { fill: '#3d2460', edge: '#8b5cf6', face: '#1a1028', glow: 'rgba(139, 92, 246, 0.4)' },
    20: { fill: '#6b1f2a', edge: '#e8c547', face: '#2a1218', glow: 'rgba(232, 197, 71, 0.5)' },
    100: { fill: '#1a3a5c', edge: '#7dd3fc', face: '#0d1e30', glow: 'rgba(125, 211, 252, 0.4)' },
  }
  return sets[props.sides] ?? { fill: '#2a2638', edge: '#c9a227', face: '#1a1824', glow: 'rgba(201, 162, 39, 0.35)' }
})

const displayValue = computed(() => {
  if (props.rolling) return '·'
  if (props.value == null) return `d${props.sides === 100 ? '100' : props.sides}`
  if (props.sides === 100) return String(props.value).padStart(2, '0')
  return String(props.value)
})

const fontSize = computed(() => {
  const base = props.size === 'sm' ? 14 : props.size === 'lg' ? 28 : 22
  if (props.value == null && props.showLabel) return base * 0.55
  if (props.sides === 100 && props.value != null) return base * 0.75
  if (String(displayValue.value).length > 2) return base * 0.65
  return base
})

const dieType = computed(() => {
  if (props.sides === 100) return 'd100'
  if ([4, 6, 8, 10, 12, 20].includes(props.sides)) return `d${props.sides}`
  return 'generic'
})
</script>

<template>
  <div
    class="die-visual"
    :class="[
      `die-visual--${size}`,
      {
        'die-visual--kept': kept,
        'die-visual--discarded': discarded,
        'die-visual--rolling': rolling,
        'die-visual--nat': value === 20 && sides === 20,
        'die-visual--fail': value === 1 && sides === 20,
      },
    ]"
    :style="{ '--die-glow': palette.glow }"
  >
    <svg
      :width="px"
      :height="px"
      :viewBox="`0 0 ${px} ${px}`"
      class="die-svg"
      role="img"
      :aria-label="value != null ? `d${sides} rolled ${value}` : `d${sides} die`"
    >
      <defs>
        <linearGradient :id="`die-grad-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="palette.edge" />
          <stop offset="45%" :stop-color="palette.fill" />
          <stop offset="100%" :stop-color="palette.face" />
        </linearGradient>
        <filter :id="`die-shadow-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.45" />
        </filter>
      </defs>

      <!-- d4 — tetrahedron -->
      <g v-if="dieType === 'd4'" :filter="`url(#die-shadow-${uid})`">
        <polygon
          :points="`${px * 0.5},${px * 0.08} ${px * 0.92},${px * 0.88} ${px * 0.08},${px * 0.88}`"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
        <polygon
          :points="`${px * 0.5},${px * 0.08} ${px * 0.72},${px * 0.55} ${px * 0.28},${px * 0.55}`"
          :fill="palette.face"
          opacity="0.35"
        />
      </g>

      <!-- d6 — cube face -->
      <g v-else-if="dieType === 'd6'" :filter="`url(#die-shadow-${uid})`">
        <rect
          :x="px * 0.14"
          :y="px * 0.14"
          :width="px * 0.72"
          :height="px * 0.72"
          rx="8"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
        <rect
          :x="px * 0.14"
          :y="px * 0.14"
          :width="px * 0.72"
          :height="px * 0.2"
          rx="8"
          :fill="palette.edge"
          opacity="0.25"
        />
      </g>

      <!-- d8 — octahedron (diamond) -->
      <g v-else-if="dieType === 'd8'" :filter="`url(#die-shadow-${uid})`">
        <polygon
          :points="`${px * 0.5},${px * 0.06} ${px * 0.94},${px * 0.5} ${px * 0.5},${px * 0.94} ${px * 0.06},${px * 0.5}`"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
        <polygon
          :points="`${px * 0.5},${px * 0.06} ${px * 0.72},${px * 0.5} ${px * 0.5},${px * 0.5}`"
          :fill="palette.face"
          opacity="0.3"
        />
      </g>

      <!-- d10 / d100 — pentagonal trapezoid -->
      <g v-else-if="dieType === 'd10' || dieType === 'd100'" :filter="`url(#die-shadow-${uid})`">
        <polygon
          :points="`${px * 0.5},${px * 0.05} ${px * 0.88},${px * 0.38} ${px * 0.72},${px * 0.92} ${px * 0.28},${px * 0.92} ${px * 0.12},${px * 0.38}`"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
        <polygon
          :points="`${px * 0.5},${px * 0.05} ${px * 0.72},${px * 0.38} ${px * 0.5},${px * 0.55}`"
          :fill="palette.face"
          opacity="0.3"
        />
      </g>

      <!-- d12 — dodecahedron hint (decagon) -->
      <g v-else-if="dieType === 'd12'" :filter="`url(#die-shadow-${uid})`">
        <polygon
          :points="`${px * 0.5},${px * 0.04} ${px * 0.78},${px * 0.18} ${px * 0.94},${px * 0.5} ${px * 0.78},${px * 0.82} ${px * 0.5},${px * 0.96} ${px * 0.22},${px * 0.82} ${px * 0.06},${px * 0.5} ${px * 0.22},${px * 0.18}`"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
      </g>

      <!-- d20 — icosahedron hint -->
      <g v-else-if="dieType === 'd20'" :filter="`url(#die-shadow-${uid})`">
        <polygon
          :points="`${px * 0.5},${px * 0.04} ${px * 0.85},${px * 0.28} ${px * 0.92},${px * 0.62} ${px * 0.68},${px * 0.94} ${px * 0.32},${px * 0.94} ${px * 0.08},${px * 0.62} ${px * 0.15},${px * 0.28}`"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
        <polygon
          :points="`${px * 0.5},${px * 0.04} ${px * 0.68},${px * 0.28} ${px * 0.5},${px * 0.55}`"
          :fill="palette.face"
          opacity="0.25"
        />
        <polygon
          :points="`${px * 0.5},${px * 0.55} ${px * 0.68},${px * 0.94} ${px * 0.32},${px * 0.94}`"
          :fill="palette.edge"
          opacity="0.15"
        />
      </g>

      <!-- generic fallback -->
      <g v-else :filter="`url(#die-shadow-${uid})`">
        <circle
          :cx="px * 0.5"
          :cy="px * 0.5"
          :r="px * 0.38"
          :fill="`url(#die-grad-${uid})`"
          :stroke="palette.edge"
          stroke-width="2"
        />
      </g>

      <text
        :x="px * 0.5"
        :y="dieType === 'd4' ? px * 0.62 : px * 0.54"
        text-anchor="middle"
        dominant-baseline="middle"
        class="die-value"
        :style="{ fontSize: `${fontSize}px` }"
      >
        {{ displayValue }}
      </text>
    </svg>
    <span v-if="kept" class="die-kept-badge">★</span>
  </div>
</template>

<style scoped>
.die-visual {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.die-svg {
  display: block;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.die-value {
  fill: #f5f0e6;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.die-visual--rolling .die-svg {
  animation: tumble 0.28s ease-in-out;
}

.die-visual--kept .die-svg {
  filter: drop-shadow(0 0 10px var(--die-glow));
  transform: scale(1.06);
}

.die-visual--discarded {
  opacity: 0.4;
}

.die-visual--discarded .die-svg {
  transform: scale(0.92);
  filter: grayscale(0.5);
}

.die-visual--nat .die-svg {
  filter: drop-shadow(0 0 14px rgba(74, 222, 128, 0.55));
}

.die-visual--fail .die-svg {
  filter: drop-shadow(0 0 14px rgba(248, 113, 113, 0.45));
}

.die-kept-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 0.75rem;
  color: var(--gold-bright, #e8c547);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

@keyframes tumble {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-12deg) scale(1.05);
  }
  50% {
    transform: rotate(8deg) scale(0.95);
  }
  75% {
    transform: rotate(-6deg) scale(1.03);
  }
}
</style>

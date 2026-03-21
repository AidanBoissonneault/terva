<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Bean } from '@/types';

const props = defineProps<{
	bean: Bean
}>()

const lightness = ref('0.7') // fallback default

onMounted(() => {
	lightness.value = getComputedStyle(document.documentElement)
		.getPropertyValue('--lightness')
		.trim()
})

const priColor = computed(() =>
	`oklch(${lightness.value} ${props.bean.pri_chroma} ${props.bean.pri_hue})`
)
const priColorShadow = computed(() =>
	`oklch(${Number(lightness.value) - 0.15} ${props.bean.pri_chroma} ${props.bean.pri_hue})`
)
const secColor = computed(() =>
	`oklch(${lightness.value} ${props.bean.sec_chroma} ${props.bean.sec_hue})`
)
const accColor = computed(() =>
	`oklch(${lightness.value} ${props.bean.acc_chroma} ${props.bean.acc_hue})`
)

const elevationNorm = computed(() =>
	Math.min(props.bean.elevation_m ?? 0 / 3000, 1)
)

const g1x = computed(() => 10 + elevationNorm.value * 20) // 10% → 30%
const g1y = computed(() => 40 + elevationNorm.value * 20) // 40% → 60%

const g2x = computed(() => 40 + elevationNorm.value * 20) // 40% → 60%
const g2y = computed(() => 50 + elevationNorm.value * 20) // 50% → 70%

const g3x = computed(() => 70 + elevationNorm.value * 20) // 70% → 90%
const g3y = computed(() => 30 + elevationNorm.value * 20) // 30% → 50%
</script>

<template>
	<div class="bean-card">
		<slot />
	</div>
</template>

<style scoped>
.bean-card {
	grid-column: 1 / 5;
	border-radius: 12px;
	box-shadow: 0px 2px v-bind(priColorShadow);
	padding: 12px;
	position: relative;
	overflow: hidden;
	background-color: v-bind(priColor);
	background-image:
  radial-gradient(
    ellipse 80% 100% at v-bind(g1x + '%') v-bind(g1y + '%'),
    v-bind(priColor) 0%,
    v-bind(priColor) 45%,
    transparent 100%
  ),
  radial-gradient(
    ellipse 75% 110% at v-bind(g2x + '%') v-bind(g2y + '%'),
    v-bind(secColor) 0%,
    v-bind(secColor) 45%,
    transparent 100%
  ),
  radial-gradient(
    ellipse 85% 100% at v-bind(g3x + '%') v-bind(g3y + '%'),
    v-bind(accColor) 0%,
    v-bind(accColor) 45%,
    transparent 100%
  );
	z-index: 0;
}

.bean-card::before {
  content: "";
  position: absolute;
  inset: -10%;
  background: inherit;
  filter: blur(30px);
  opacity: 0.6;
  z-index: -1;
}
</style>

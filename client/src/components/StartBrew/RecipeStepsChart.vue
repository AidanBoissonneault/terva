<!--
Recipe Step Chart
This outputs a chart of the steps of a recipe inputted through props.
Truthfully, this component was made with lots of googling,
and AI to trouble shoot some nasty type specificities while porting,
so please do not quiz me on chart.js integration.
CREATED: 28MAR2026
LAST EDITED: 28MAR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
	Chart,
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
} from 'chart.js'
import type { ChartDataset } from 'chart.js'
import { type RecipeStep, type Recipe } from '@/types'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps<{ recipe: Recipe }>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const PALETTE = isDark
	? [
		'rgba(175,169,236,0.85)',
		'rgba(93,202,165,0.85)',
		'rgba(250,199,117,0.85)',
		'rgba(240,153,123,0.85)',
		'rgba(133,183,235,0.85)',
		'rgba(212,131,196,0.85)',
		'rgba(141,210,78,0.85)',
	]
	: [
		'rgba(127,119,221,0.75)',
		'rgba(29,158,117,0.75)',
		'rgba(186,117,23,0.75)',
		'rgba(216,90,48,0.75)',
		'rgba(55,138,221,0.75)',
		'rgba(153,53,86,0.75)',
		'rgba(75,109,17,0.75)',
	]

const TEXT_P = isDark ? '#c2c0b6' : '#3d3d3a'
const TEXT_S = isDark ? '#7a7870' : '#888780'
const BORDER = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
const TOOLTIP_BG = isDark ? '#2c2c2a' : '#ffffff'

function formatTime(s: number): string {
	if (s <= 0) return '0s'
	const m = Math.floor(s / 60)
	const sec = s % 60
	return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
}

function buildChartData(steps: RecipeStep[]) {
	const starts: number[] = []
	let cum = 0
	for (const s of steps) {
		starts.push(cum)
		cum += s.duration
	}

	const total = cum
	const labels = steps.map((_, i) => `Step ${i + 1}`)
	const allDatasets: ChartDataset<'bar'>[] = []

	steps.forEach((step, i) => {
		const color = PALETTE[i % PALETTE.length]
		allDatasets.push({
			label: `__spacer_${i}`,
			data: steps.map((_, j): number => (j === i ? starts[i] ?? 0 : 0)),
			backgroundColor: 'transparent',
			borderColor: 'transparent',
			borderRadius: 0,
			borderSkipped: false,
		})
		allDatasets.push({
			label: step.action,
			data: steps.map((_, j): number => (j === i ? step.duration : 0)),
			backgroundColor: color,
			borderColor: 'transparent',
			borderRadius: 4,
			borderSkipped: false,
		})
	})

	return { labels, allDatasets, starts, total }
}

function buildChart() {
	if (!canvasEl.value) return
	if (chart) { chart.destroy(); chart = null }

	const steps = props.recipe.steps
	const { labels, allDatasets, starts, total } = buildChartData(steps)

	chart = new Chart(canvasEl.value, {
		type: 'bar',
		data: { labels, datasets: allDatasets },
		options: {
			indexAxis: 'y',
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					filter: (item) => !(item.dataset.label ?? '').startsWith('__spacer'),
					callbacks: {
						title: (items) => steps[items[0]?.dataIndex ?? -1]?.action ?? '',
						label: (item) => {
							const dur = (item.raw as number | undefined) ?? 0
							const start = starts[item.dataIndex] ?? 0
							return `  ${formatTime(start)} → ${formatTime(start + dur)}  (${formatTime(dur)})`
						},
					},
					backgroundColor: TOOLTIP_BG,
					titleColor: TEXT_P,
					bodyColor: TEXT_S,
					borderColor: BORDER,
					borderWidth: 1,
					padding: 10,
					cornerRadius: 8,
				},
			},
			scales: {
				x: {
					stacked: true,
					min: 0,
					max: total,
					grid: { color: BORDER },
					ticks: {
						color: TEXT_S,
						font: { size: 11 },
						callback: (v) => (v === 0 ? '0s' : formatTime(v as number)),
						maxTicksLimit: 8,
					},
					border: { display: false },
				},
				y: {
					stacked: true,
					grid: { display: false },
					ticks: { color: TEXT_S, font: { size: 12 } },
					border: { display: false },
				},
			},
			layout: { padding: { right: 8 } },
		},
	})
}

onMounted(buildChart)
onBeforeUnmount(() => chart?.destroy())
watch(() => props.recipe, buildChart, { deep: true })

const totalDuration = () =>
	props.recipe.steps.reduce((a, s) => a + s.duration, 0)
</script>

<template>
	<div class="steps-chart">
		<div class="legend">
			<span v-for="(step, i) in recipe.steps" :key="step.id" class="legend-item">
				<span class="swatch" :style="{ background: PALETTE[i % PALETTE.length] }" />
				{{ step.action }}
			</span>
		</div>

		<div class="canvas-wrap" :style="{ height: recipe.steps.length * 52 + 32 + 'px' }">
			<canvas ref="canvasEl" />
		</div>

		<div class="total">Total brew time: {{ formatTime(totalDuration()) }}</div>
	</div>
</template>

<style scoped>
.steps-chart {
	width: 100%;
}

.legend {
	display: flex;
	flex-wrap: wrap;
	gap: 8px 16px;
	margin-bottom: 14px;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: var(--neutral-500);
}

.swatch {
	width: 10px;
	height: 10px;
	border-radius: 2px;
	flex-shrink: 0;
}

.canvas-wrap {
	position: relative;
	width: 100%;
}

canvas {
	display: block;
}

.total {
	margin-top: 10px;
	font-size: 12px;
	color: var(--neutral-400);
	text-align: right;
}
</style>

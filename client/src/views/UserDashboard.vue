<script setup lang="ts">
import { getBeans } from '@/api/getBeans'
import BeanCard from '@/components/BeanCard/BeanCard.vue'
import HeroBeanCard from '@/components/BeanCard/HeroBeanCard.vue'
import FilterButton from '@/components/FilterButton/FilterButton.vue'
import SectionSeperator from '@/components/SectionSeperator.vue'
import { useLoadingStore } from '@/stores/loading'
import { computed, onMounted, reactive, ref } from 'vue'
import { type Bean, type BeanState } from '@/types'

const beans = ref()
const heroBean = ref()
const error = ref<string | null>(null)

const filterButtons = reactive<{ name: string, type: BeanState | null }[]>([
	{ name: "Fresh", type: "fresh" },
	{ name: "Frozen", type: "frozen" },
	{ name: "Finished", type: "finished" },
	{ name: "All", type: null },
])

const filteredBeans = computed(() => {
	if (!beans.value) return []

	if (!activeFilter.value) return beans.value

  return beans.value.filter((bean: Bean) => bean.status === activeFilter.value)
})
const activeFilter = ref<BeanState | null>(null)

function newFilter(type: BeanState | null) {
	if (activeFilter.value === type) {
		activeFilter.value = null
		return
	}
	activeFilter.value = type
}

onMounted(async () => {

	// start loading screen
	const loading = useLoadingStore()
	loading.start()
	try {
		// get data
		const data = await getBeans()

		// error handling
		if (!data.success) {
			throw new Error(data.error);
		}
		// split payload
		heroBean.value = data.payload[0]         // most recent is first (ORDER BY created_at DESC)
		beans.value = data.payload.slice(1)      // rest go to the grid

		// log data (for testing)
		console.log(data)
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		loading.stop()
	}
})
</script>

<template>
	<div class="dashboard">
		<div v-if="error">{{ error }}</div>

		<template v-else-if="heroBean">
			<HeroBeanCard :bean="heroBean" />
			<SectionSeperator />
			<div class="filter-wrapper">
				<h5>Beans</h5>
				<div class="filter-buttons">
					<FilterButton v-for="filter in filterButtons" @filter="newFilter" :key="filter.name"
						:type="filter.type" :active-filter="activeFilter">
						{{ filter.name }}
					</FilterButton>
				</div>
			</div>
			<BeanCard v-for="bean in filteredBeans" :key="bean.id" :bean="bean" />
		</template>
	</div>
</template>

<style scoped>
.dashboard {
	display: grid;
	gap: 16px;
	grid-template-columns: repeat(4, 1fr);
	margin-left: 24px;
	margin-right: 24px;

	overflow: visible;
}

.filter-wrapper {
	display: flex;
	justify-content: space-between;
	align-content: flex-end;

	grid-column: 1 / 5;
}

.filter-buttons {
	display: flex;
	justify-content: center;
	align-content: center;
}

h5 {
	margin: 0;
	margin-left: 4px;
	padding: 0;
	line-height: 1;

	color: var(--brand-200);
}
</style>

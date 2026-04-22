<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue'
import BeanCardSkeleton from '@/components/BeanCard/BeanCardSkeleton.vue'
import BrewCard from '@/components/BeanInfo/BrewCard.vue'
import BrewCardSkeleton from '@/components/BeanInfo/BrewCardSkeleton.vue'
import { useRouter } from 'vue-router'
import { type Brew, type Bean, type Gear, type Recipe } from '@terva/shared'
import { computed, onMounted, ref, watch } from 'vue'
import { TextMorph } from 'torph/vue'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import { getBrews } from '@/api/getBrews'
import { getBrewStartData } from '@/api/getStartBrewData'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import FilterBar from '@/components/Utils/FilterBar.vue'
import { useErrorStore } from '@/stores/error'

const router = useRouter()

const currentBean = ref<Bean>()
const brews = ref<Brew[]>([])
const gears = ref<Gear[]>([])
const recipes = ref<Recipe[]>([])
const isReady = ref(false)

// clear the brew transfer (in case) and go to start brew
function skip() {
	const brewTransfer = useBrewTransferStore()
	brewTransfer.clear()
	router.push({ name: 'startbrew' })
}

function navigateToEditBean() {
	router.push({ name: 'editbean' })
}

const activeFilter = ref<string | null>(null)

const filterButtons: { name: string; type: string | null }[] = [
	{ name: 'Success', type: 'success' },
	{ name: 'Close', type: 'close' },
	{ name: 'Miss', type: 'miss' },
	{ name: 'Unfinished', type: 'unfinished' },
	{ name: 'All', type: null },
]

const filterLabel = computed(
	() => (filterButtons.find((b) => b.type === activeFilter.value)?.name ?? 'All') + ' Brews',
)

const morphFilterLabel = ref('')

watch(filterLabel, (val) => requestAnimationFrame(() => (morphFilterLabel.value = val)), {
	immediate: true,
	flush: 'post',
})

const filteredBrews = computed(() => {
	if (!brews.value) return []
	if (!activeFilter.value) return brews.value

	if (activeFilter.value === 'unfinished') {
		return brews.value.filter((brew: Brew) => brew.status === 'in_progress' || brew.status === 'unfinished')
	}

	return brews.value.filter((brew: Brew) => brew.status === 'finished' && brew.closeness === activeFilter.value)
})

// sets the current filter to a new filter.
// if a button that is currently active is pressed again, remove filter
function newFilter(type: string | null) {
	if (activeFilter.value === type) {
		activeFilter.value = null
		return
	}
	activeFilter.value = type
}

onMounted(async () => {
	const beanStore = useCurrentBeanStore()
	currentBean.value = beanStore.get()

	try {
		const resBrews = await getBrews(currentBean.value.id)
		if (!resBrews.success) throw new Error(resBrews.error)
		brews.value = resBrews.payload

		const resBrewStartData = await getBrewStartData()
		if (!resBrewStartData.success) throw new Error(resBrewStartData.error)
		gears.value = resBrewStartData.payload.gears
		recipes.value = resBrewStartData.payload.recipes
	} catch (err) {
		const errorStore = useErrorStore()
		errorStore.set(
			err instanceof Error ? err.message : 'Failed to load brew history for this bean.',
			'dashboard',
		)
		router.push({ name: 'error' })
		return
	}

	isReady.value = true
})
</script>

<template>
	<div class="dashboard">
		<BeanCardSkeleton v-if="!isReady" style="grid-column: 1 / 5" />
		<BeanCard v-else-if="currentBean" :bean="currentBean" @clicked="navigateToEditBean" />

		<SectionSeperator />

		<button @click="skip" class="glass skip big-text">Start Fresh</button>

		<SectionSeperator />

		<FilterBar :filters="filterButtons" :active-filter="activeFilter" @filter="newFilter">
			<template #label>
				<h5>
					<TextMorph :text="morphFilterLabel" />
				</h5>
			</template>
		</FilterBar>

		<template v-if="!isReady">
			<BrewCardSkeleton v-for="i in 3" :key="i" />
		</template>
		<template v-else>
			<BrewCard
				v-for="brew in filteredBrews"
				:key="brew.id ?? brew.recipeId"
				:brew="brew"
				:gear="gears"
				:recipes="recipes"
			/>
		</template>
	</div>
</template>

<style scoped>
.dashboard {
	position: relative;
}

small {
	grid-column: span 4;
}

button.skip {
	grid-column: span 4;
}

:deep(.filter-wrapper) {
	grid-column: span 4;
}

:deep(h5) {
	margin: 0;
	margin-left: 4px;
	padding: 0;
	line-height: 1;

	color: var(--brand-200);
}
</style>

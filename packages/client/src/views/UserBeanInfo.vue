<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue'
import BeanCardSkeleton from '@/components/BeanCard/BeanCardSkeleton.vue'
import BrewCard from '@/components/BeanInfo/BrewCard.vue'
import BrewCardSkeleton from '@/components/BeanInfo/BrewCardSkeleton.vue'
import { useRouter } from 'vue-router'
import { type Brew, type Bean, type Gear, type Recipe } from '@terva/shared'
import { computed, onMounted, ref } from 'vue'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import { getBrews } from '@/api/getBrews'
import { getBrewStartData } from '@/api/getStartBrewData'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import FilterButton from '@/components/FilterButton/FilterButton.vue'

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

const filterButtons: { name: string, type: string | null }[] =[
	{ name: "Success", type: "success" },
	{ name: "Close", type: "close" },
	{ name: "Miss", type: "miss" },
	{ name: "All", type: null },
]

// calculates and maintains the filtered beans for when
// the filter buttons are pressed.
const filteredBrews = computed(() => {
	if (!brews.value) return []

	if (!activeFilter.value) return brews.value

  return brews.value.filter((brew: Brew) => brew.closeness === activeFilter.value)
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

	const resBrews = await getBrews(currentBean.value.id)
	console.log(resBrews)

	if (resBrews.success)
		brews.value = resBrews.payload

	const resBrewStartData = await getBrewStartData()
	console.log(resBrewStartData)

	if (resBrewStartData.success) {
		gears.value = resBrewStartData.payload.gears
		recipes.value = resBrewStartData.payload.recipes
	}

	isReady.value = true
})
</script>

<template>
	<div class="dashboard">
		<template v-if="!isReady">
			<BeanCardSkeleton style="grid-column: 1 / 5" />
			<SectionSeperator />
			<BrewCardSkeleton v-for="i in 3" :key="i" />
		</template>
		<template v-else>
		<BeanCard v-if="currentBean" :bean="currentBean" @clicked="navigateToEditBean"/>
		<SectionSeperator />

		<button @click="skip" class="glass skip big-text">Start Fresh</button>

		<template v-if="brews.length > 0">
			<SectionSeperator />
			<div class="filter-wrapper">
				<FilterButton v-for="filter in filterButtons" @filter="newFilter" :key="filter.name"
					:type="filter.type" :active-filter="activeFilter">
					{{ filter.name }}
				</FilterButton>
			</div>
			<BrewCard v-for="brew in filteredBrews" :key="brew.id ?? brew.recipeId" :brew="brew" :gear="gears" :recipes="recipes" />
		</template>
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

.filter-wrapper {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;

	grid-column: span 4;
}
</style>

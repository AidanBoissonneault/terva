<!--
User Dashboard
Main screen of the app after login.

CREATED: 17MAR2026
LAST EDITED: 02APR2026
By: Aidan Boisonneault
-->

<script setup lang="ts">
import { getBeans } from '@/api/getBeans'
import BeanCard from '@/components/BeanCard/BeanCard.vue'
import HeroBeanCard from '@/components/BeanCard/HeroBeanCard.vue'
import FilterButton from '@/components/FilterButton/FilterButton.vue'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import { useLoadingStore } from '@/stores/loading'
import { computed, onMounted, reactive, ref } from 'vue'
import { type Bean, type BeanState, type Brew } from '@terva/shared'
import { useRouter } from 'vue-router'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import { getRecentBrews } from '@/api/getRecentBrews'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'

// for routing when a bean card is pressed
const router = useRouter()

// for all beans (except hero bean), hero bean, and if there was an error
const beans = ref()
const heroBean = ref()
const error = ref<string | null>(null)

// for hero bean quick-access
const recentHeroBrews = ref()

// stores the currently active filter for the filter buttons
const activeFilter = ref<string | null>(null)

	// stores if the Delete Bean warning is being shown.
const isWarnDeleteBean = ref<boolean>(false)

// stores the bean the user is attempting to delete
const deletedBean = ref<Bean>()

// stores all filter buttons.
// name is displaced, type is for backend.
const filterButtons = reactive<{ name: string, type: BeanState | null }[]>([
	{ name: "Fresh", type: "fresh" },
	{ name: "Frozen", type: "frozen" },
	{ name: "Finished", type: "finished" },
	{ name: "All", type: null },
])

// calculates and maintains the filtered beans for when
// the filter buttons are pressed.
const filteredBeans = computed(() => {
	if (!beans.value) return []

	if (!activeFilter.value) return beans.value

  return beans.value.filter((bean: Bean) => String(bean.state) === String(activeFilter.value))
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

// ran when the component is mounted to DOM
onMounted(async () => {

	// start loading screen
	const loading = useLoadingStore()
	loading.start()
	try {
		// get bean data
		const data = await getBeans()

		// error handling
		if (!data.success) {
			throw new Error(data.error);
		}
		// split payload
		heroBean.value = data.payload[0]    // most recent is hero bean
		beans.value = data.payload.slice(1) // rest go to the regular beans

		// get recent brew data for hero bean
		if (heroBean.value) {
			const recentBrews = await getRecentBrews(heroBean.value.id)
			if (recentBrews.success)
				recentHeroBrews.value = recentBrews.payload
			console.log(recentBrews)
		}

		// log data (for testing)
		console.log(data)
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		loading.stop()
	}
})

// routes when bean card is pressed to the Bean Brew screen.
function routeToBeanInfo(bean: Bean) {
	const currentBean = useCurrentBeanStore()
	currentBean.set(bean)
	router.push({ name: 'beaninfo' })
}

// routes when bean card's edit button is pressed to the Bean Edit screen.
function routeToBeanEdit(bean: Bean) {
	const currentBean = useCurrentBeanStore()
	currentBean.set(bean)
	router.push({ name: 'editbean' })
}

// saves the selected brew to state
// and routes to the startbrew screen for quicker access
function quickAccessBrew(brew: Brew) {
	const brewTransfer = useBrewTransferStore()
	brewTransfer.set(brew)
	router.push({ name: 'startbrew' })
}

// warns if the user wants to delete a bean
function warnDeleteBean(bean: Bean) {
	deletedBean.value = bean
	isWarnDeleteBean.value = true
}

function deleteBean() {
	isWarnDeleteBean.value = false
	console.log("delete bean")
}
</script>

<template>
	<div class="dashboard">
		<div v-if="error">{{ error }}</div>

		<template v-else-if="heroBean">
			<HeroBeanCard :bean="heroBean" :brews="recentHeroBrews" @clicked="routeToBeanInfo" @brew-selected="quickAccessBrew" @edit="routeToBeanEdit" @delete="warnDeleteBean"/>
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
			<BeanCard v-for="bean in filteredBeans" :key="bean.id" :bean="bean" @clicked="routeToBeanInfo" @edit="routeToBeanEdit"/>

			<FullscreenOverlay :is-visible="isWarnDeleteBean" @outside-clicked="isWarnDeleteBean = false; deletedBean = undefined">
				<div class="confirm-content">
				<p><strong>Delete {{ deletedBean?.name }}?</strong></p>
				<small>This permanently removes your bean and all brew data. This cannot be undone.</small>
				<div class="confirm-actions">
					<button class="glass" @click="isWarnDeleteBean = false">Cancel</button>
					<button class="glass danger-btn" @click="deleteBean">Delete</button>
				</div>
			</div>
			</FullscreenOverlay>
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
	align-items: center;

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

.confirm-content, strong {
	display: flex;
	flex-direction: column;
	gap: 8px;

	color: var(--pico-primary-inverse);
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}

.danger-btn {
	border-color: oklch(from var(--red-500) l c h / 0.5) !important;
	color: var(--red-400) !important;
}
</style>

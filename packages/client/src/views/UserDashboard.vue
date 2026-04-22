<!--
User Dashboard
Main screen of the app after login.

CREATED: 17MAR2026
LAST EDITED: 16APR2026
By: Aidan Boisonneault
-->

<script setup lang="ts">
import { getBeans } from '@/api/getBeans'
import { getInProgressBrews, type InProgressBrew } from '@/api/getInProgressBrews'
import { editBrew } from '@/api/editBrew'
import BeanCardSkeleton from '@/components/BeanCard/BeanCardSkeleton.vue'
import FilterBar from '@/components/Utils/FilterBar.vue'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import { computed, defineAsyncComponent, onMounted, reactive, ref, watch } from 'vue'
import { type Bean, type BeanState, type Brew } from '@terva/shared'
import { useRouter } from 'vue-router'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import { useErrorStore } from '@/stores/error'
import { getRecentBrews } from '@/api/getRecentBrews'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import { TextMorph } from 'torph/vue'

// Async components — required for <Suspense> to catch their setup promises
const HeroBeanCard = defineAsyncComponent(() => import('@/components/BeanCard/HeroBeanCard.vue'))
const BeanCard = defineAsyncComponent(() => import('@/components/BeanCard/BeanCard.vue'))

// for routing when a bean card is pressed
const router = useRouter()

// for all beans (except hero bean), hero bean
const beans = ref()
const heroBean = ref()

// unfinished brew resume popup
const resumeBrew = ref<InProgressBrew | null>(null)
const showResumePopup = ref(false)

const isReady = ref(false)

// for hero bean quick-access
const recentHeroBrews = ref()

// stores the currently active filter for the filter buttons
const activeFilter = ref<BeanState | null>(null)

// stores all filter buttons.
// name is displaced, type is for backend.
const filterButtons = reactive<{ name: string; type: BeanState | null }[]>([
	{ name: 'Fresh', type: 'fresh' },
	{ name: 'Frozen', type: 'frozen' },
	{ name: 'Finished', type: 'finished' },
	{ name: 'All', type: null },
])
// label shown in the h5 - driven by a separate ref so we can
// animate it independently of the computed value
const filterLabel = computed(
	() => (filterButtons.find((b) => b.type === activeFilter.value)?.name ?? 'All') + ' Beans',
)

// groups beans into their respective categories
const groupedBeans = computed(() => {
	if (!beans.value) return { fresh: [], frozen: [], finished: [] }

	return {
		fresh: beans.value.filter((b: Bean) => b.state === 'fresh'),
		frozen: beans.value.filter((b: Bean) => b.state === 'frozen'),
		finished: beans.value.filter((b: Bean) => b.state === 'finished'),
	}
})

// sets the current filter to a new filter.
// if a button that is currently active is pressed again, remove filter
function newFilter(type: BeanState | null) {
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
			throw new Error(data.error)
		}
		// split payload
		const allBeans: Bean[] = data.payload
		const hero =
			allBeans.find((b) => b.state === 'fresh') ||
			allBeans.find((b) => b.state === 'frozen') ||
			allBeans.find((b) => b.state === 'finished') ||
			null

		heroBean.value = hero

		// remove hero from list
		beans.value = hero ? allBeans.filter((b) => b.id !== hero.id) : allBeans

		// get recent brew data for hero bean
		if (heroBean.value) {
			const recentBrews = await getRecentBrews(heroBean.value.id)
			if (recentBrews.success) recentHeroBrews.value = recentBrews.payload
			console.log(recentBrews)
		}

		// check for in-progress brews (once per session)
		if (!sessionStorage.getItem('inProgressBrewChecked')) {
			sessionStorage.setItem('inProgressBrewChecked', '1')
			const inProgressResult = await getInProgressBrews()
			if (inProgressResult.success && inProgressResult.payload.length > 0) {
				// group by beanId — results already ordered by brewed_at DESC per bean
				const byBean = new Map<number, InProgressBrew[]>()
				for (const brew of inProgressResult.payload) {
					const key = brew.beanId ?? -1
					if (!byBean.has(key)) byBean.set(key, [])
					byBean.get(key)!.push(brew)
				}

				// mark older duplicates within same bean as 'unfinished'
				const mostRecentPerBean: InProgressBrew[] = []
				for (const [, brews] of byBean) {
					const [newest, ...stale] = brews
					if (!newest) continue
					mostRecentPerBean.push(newest)
					for (const old of stale) {
						old.closeness = 'close'
						editBrew(old.id, { ...old, status: 'unfinished' })
					}
				}

				// show popup for the single most recent in-progress brew overall
				mostRecentPerBean.sort((a, b) => b.id - a.id)
				const candidate = mostRecentPerBean[0]
				if (candidate) {
					resumeBrew.value = candidate
					showResumePopup.value = true
				}
			}
		}

		// log data (for testing)
		console.log(data)
	} catch (err) {
		const errorStore = useErrorStore()
		errorStore.set(
			err instanceof Error ? err.message : 'Failed to load your beans. Please try again.',
			'dashboard',
		)
		router.push({ name: 'error' })
		return
	} finally {
		loading.stop()
		isReady.value = true
	}
})

// routes when bean card is pressed.
// skips beaninfo if the bean has no brews yet — goes straight to startbrew.
async function routeToBeanInfo(bean: Bean) {
	const currentBean = useCurrentBeanStore()
	currentBean.set(bean)

	const recentBrews = await getRecentBrews(bean.id)
	if (recentBrews.success && recentBrews.payload.length === 0) {
		router.push({ name: 'startbrew' })
	} else {
		router.push({ name: 'beaninfo' })
	}
}

// saves the selected brew to state
// and routes to the startbrew screen for quicker access
function quickAccessBrew(brew: Brew) {
	const brewTransfer = useBrewTransferStore()
	brewTransfer.set(brew)

	const currentBean = useCurrentBeanStore()
	currentBean.set(heroBean.value)

	router.push({ name: 'startbrew' })
}

function goToEndBrew() {
	if (!resumeBrew.value) return
	const brewTransfer = useBrewTransferStore()
	brewTransfer.set(resumeBrew.value)
	showResumePopup.value = false
	router.push({ name: 'endbrew' })
}

const morphFilterLabel = ref('All beans')

watch(filterLabel, (val) => requestAnimationFrame(() => (morphFilterLabel.value = val)), {
	immediate: true,
	flush: 'post',
})
</script>

<template>
	<div class="dashboard">
		<!--  Loading skeletons (shown while isReady is false)  -->
		<template v-if="!isReady">
			<!-- Hero skeleton -->
			<BeanCardSkeleton :hero="true" />
			<SectionSeperator />
		</template>

		<!--  Hero bean  -->
		<template v-else-if="heroBean">
			<Suspense>
				<HeroBeanCard
					:bean="heroBean"
					:brews="recentHeroBrews"
					@clicked="routeToBeanInfo"
					@brew-selected="quickAccessBrew"
				/>
				<template #fallback>
					<BeanCardSkeleton :hero="true" style="grid-column: 1 / 5" />
				</template>
			</Suspense>
			<SectionSeperator />
		</template>

		<!-- Filter -->
		<FilterBar
			v-if="!isReady || beans.length > 0"
			:filters="filterButtons"
			:active-filter="activeFilter"
			@filter="newFilter"
			style="grid-column: 1 / 5"
		>
			<template #label>
				<h5>
					<TextMorph :text="morphFilterLabel" />
				</h5>
			</template>
		</FilterBar>

		<!-- bean cards -->
		<template v-if="isReady && beans">
			<!-- all beans (grouped) -->
			<template v-if="!activeFilter">
				<div class="bean-section" v-if="groupedBeans.fresh.length">
					<h6 class="section-title">Fresh</h6>
					<TransitionGroup name="beans" tag="div" class="bean-grid">
						<Suspense v-for="(bean, i) in groupedBeans.fresh" :key="bean.id">
							<BeanCard
								:bean="bean"
								:style="{ transitionDelay: `${Number(i) * 60}ms` }"
								@clicked="routeToBeanInfo"
							/>
							<template #fallback>
								<BeanCardSkeleton :style="{ transitionDelay: `${Number(i) * 60}ms` }" />
							</template>
						</Suspense>
					</TransitionGroup>
				</div>

				<div class="bean-section" v-if="groupedBeans.frozen.length">
					<h6 class="section-title">Frozen</h6>
					<TransitionGroup name="beans" tag="div" class="bean-grid">
						<Suspense v-for="(bean, i) in groupedBeans.frozen" :key="bean.id">
							<BeanCard
								:bean="bean"
								:style="{ transitionDelay: `${Number(i) * 60}ms` }"
								@clicked="routeToBeanInfo"
							/>
							<template #fallback>
								<BeanCardSkeleton :style="{ transitionDelay: `${Number(i) * 60}ms` }" />
							</template>
						</Suspense>
					</TransitionGroup>
				</div>

				<div class="bean-section" v-if="groupedBeans.finished.length">
					<h6 class="section-title">Finished</h6>
					<TransitionGroup name="beans" tag="div" class="bean-grid">
						<Suspense v-for="(bean, i) in groupedBeans.finished" :key="bean.id">
							<BeanCard
								:bean="bean"
								:style="{ transitionDelay: `${Number(i) * 60}ms` }"
								@clicked="routeToBeanInfo"
							/>
							<template #fallback>
								<BeanCardSkeleton :style="{ transitionDelay: `${Number(i) * 60}ms` }" />
							</template>
						</Suspense>
					</TransitionGroup>
				</div>
			</template>

			<!-- filtered beans (flat, no title) -->
			<template v-else-if="beans.length">
				<TransitionGroup name="beans" tag="div" class="bean-grid full-width">
					<Suspense v-for="(bean, i) in groupedBeans[activeFilter]" :key="bean.id">
						<BeanCard
							:bean="bean"
							:style="{ transitionDelay: `${Number(i) * 60}ms` }"
							@clicked="routeToBeanInfo"
						/>
						<template #fallback>
							<BeanCardSkeleton :style="{ transitionDelay: `${Number(i) * 60}ms` }" />
						</template>
					</Suspense>
				</TransitionGroup>
			</template>
		</template>
		<template v-else>
			<!-- Bean card skeletons (3 placeholder cards) -->
			<div class="bean-section">
				<div class="skel skel-section-title" />
				<div class="bean-grid">
					<BeanCardSkeleton v-for="n in 3" :key="n" />
				</div>
			</div>
		</template>
	</div>

	<div class="no-beans" v-if="isReady">
		<span class="empty-label full-screen" v-if="!heroBean"
			>No beans added yet. Hit the <RouterLink to="/bean/add">+ button</RouterLink> to get
			started!</span
		>
		<span class="empty-label" v-else-if="!beans.length"
			>No more beans. Hit the <RouterLink to="/bean/add">+ button</RouterLink> to add more!</span
		>
	</div>

	<!-- Resume unfinished brew popup -->
	<FullscreenOverlay :is-visible="showResumePopup" @outside-clicked="showResumePopup = false">
		<div class="resume-content" v-if="resumeBrew">
			<p><strong>Unfinished brew</strong></p>
			<small>
				{{ resumeBrew.beanName }}
				<template v-if="resumeBrew.beanRoaster"> · {{ resumeBrew.beanRoaster }}</template>
			</small>
			<div class="resume-actions">
				<button class="glass secondary" @click="showResumePopup = false">Dismiss</button>
				<button class="glass" @click="goToEndBrew">Resume</button>
			</div>
		</div>
	</FullscreenOverlay>
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

h5 {
	margin: 0;
	margin-left: 4px;
	padding: 0;
	line-height: 1;

	color: var(--brand-200);
}

.bean-section {
	grid-column: 1 / 5;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.section-title {
	margin: 0;
	margin-left: 4px;
	font-size: 0.85rem;
	color: var(--brand-300);
	opacity: 0.8;
}

.bean-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
}

.bean-grid.full-width {
	grid-column: 1 / 5;
}

/* staggered animation */
.beans-enter-from {
	opacity: 0;
	transform: translateY(12px) scale(0.96);
}
.beans-enter-to {
	opacity: 1;
	transform: translateY(0) scale(1);
}
.beans-enter-active {
	transition: all 0.35s ease;
}

.beans-leave-from {
	opacity: 1;
	transform: translateY(0) scale(1);
}
.beans-leave-to {
	opacity: 0;
	transform: translateY(12px) scale(0.96);
}
.beans-leave-active {
	transition: all 0.2s ease;
	position: absolute;
}

.beans-move {
	transition: transform 0.25s ease;
}

.no-beans {
	display: flex;
	align-items: center;
	justify-content: center;
}

.resume-content,
.resume-content strong {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.resume-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}

.empty-label {
	font-size: 0.85rem;
	opacity: 1;
	margin: 0;
	padding: 4px 0;

	&.full-screen {
		margin-top: 35vh;
	}
}
</style>

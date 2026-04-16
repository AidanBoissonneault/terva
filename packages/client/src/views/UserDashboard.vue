<!--
User Dashboard
Main screen of the app after login.

CREATED: 17MAR2026
LAST EDITED: 16APR2026
By: Aidan Boisonneault
-->

<script setup lang="ts">
import { getBeans } from '@/api/getBeans'
import BeanCardSkeleton from '@/components/BeanCard/BeanCardSkeleton.vue'
import FilterButton from '@/components/FilterButton/FilterButton.vue'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import { useLoadingStore } from '@/stores/loading'
import { computed, defineAsyncComponent, onMounted, reactive, ref, watch } from 'vue'
import { type Bean, type BeanState, type Brew } from '@terva/shared'
import { useRouter } from 'vue-router'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import { getRecentBrews } from '@/api/getRecentBrews'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import { TextMorph } from 'torph/vue'

// Async components — required for <Suspense> to catch their setup promises
const HeroBeanCard = defineAsyncComponent(() => import('@/components/BeanCard/HeroBeanCard.vue'))
const BeanCard     = defineAsyncComponent(() => import('@/components/BeanCard/BeanCard.vue'))

// for routing when a bean card is pressed
const router = useRouter()

// for all beans (except hero bean), hero bean, and if there was an error
const beans = ref()
const heroBean = ref()
const error = ref<string | null>(null)

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
const visibleFilters = computed(() => filterButtons.filter((b) => b.type !== activeFilter.value))

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

// for animating section height smoothly (0 → auto)
function onBeforeEnter(el: Element) {
	const element = el as HTMLElement
	element.style.height = '0'
	element.style.opacity = '0'
}

function onEnter(el: Element) {
	const element = el as HTMLElement
	const height = element.scrollHeight

	element.style.transition = 'height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease'
	element.style.height = height + 'px'
	element.style.opacity = '1'
}

function onAfterEnter(el: Element) {
	const element = el as HTMLElement
	element.style.height = 'auto'
}

function onBeforeLeave(el: Element) {
	const element = el as HTMLElement
	element.style.height = element.scrollHeight + 'px'
}

function onLeave(el: Element) {
	const element = el as HTMLElement

	void element.offsetHeight

	element.style.transition = 'height 0.2s ease, opacity 0.15s ease'
	element.style.height = '0'
	element.style.opacity = '0'
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

		// log data (for testing)
		console.log(data)
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		loading.stop()
		isReady.value = true
	}
})

// routes when bean card is pressed to the Bean Brew screen.
function routeToBeanInfo(bean: Bean) {
	const currentBean = useCurrentBeanStore()
	currentBean.set(bean)
	router.push({ name: 'beaninfo' })
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

const morphFilterLabel = ref('All beans')

watch(
	filterLabel,
	(val) => {
		if (!val) return
		morphFilterLabel.value = ''
		requestAnimationFrame(() => {
			morphFilterLabel.value = val
		})
	},
	{
		immediate: true,
		flush: 'post'
	}
)
</script>

<template>
<div class="dashboard">
  <div v-if="error">{{ error }}</div>

  <!-- ── Loading skeletons (shown while isReady is false) ── -->
  <template v-if="!isReady">
    <!-- Hero skeleton -->
    <BeanCardSkeleton :hero="true" style="grid-column: 1 / 5" />
    <SectionSeperator style="grid-column: 1 / 5" />

    <!-- Filter bar skeleton -->
    <div class="filter-wrapper" style="grid-column: 1 / 5">
      <div class="skel skel-filter-label" />
      <div class="skel-filter-btns">
        <div class="skel skel-filter-btn" v-for="n in 3" :key="n" />
      </div>
    </div>

    <!-- Bean card skeletons (3 placeholder cards) -->
    <div class="bean-section" style="grid-column: 1 / 5">
      <div class="skel skel-section-title" />
      <div class="bean-grid">
        <BeanCardSkeleton v-for="n in 3" :key="n" />
      </div>
    </div>
  </template>

  <!-- ── Hero bean ── -->
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
  <div class="filter-wrapper" v-if="isReady && (!beans || beans.length > 0)">
    <h5>
      <TextMorph :text="morphFilterLabel" />
    </h5>

    <TransitionGroup name="filter" tag="div" class="filter-buttons">
      <FilterButton
        v-for="filter in visibleFilters"
        :key="filter.name"
        @filter="newFilter"
        :type="filter.type"
        :active-filter="activeFilter"
      >
        {{ filter.name }}
      </FilterButton>
    </TransitionGroup>
  </div>

  <!-- bean cards -->
  <template v-if="isReady && beans">
    <!-- all beans (grouped) -->
    <template v-if="!activeFilter">
      <Transition
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
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
      </Transition>

      <Transition
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
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
      </Transition>

      <Transition
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
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
      </Transition>
    </template>

    <!-- filtered beans (flat, no title) -->
    <template v-else>
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
</div>

<div class="no-beans" v-if="isReady">
  <span class="empty-label full-screen" v-if="!heroBean">No beans added yet. Hit the <RouterLink to="/bean/add">+ button</RouterLink> to get started!</span>
  <span class="empty-label" v-else-if="!beans.length">No more beans. Hit the <RouterLink to="/bean/add">+ button</RouterLink> to add more!</span>
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

.filter-label {
	display: inline-block;
	opacity: 0;
	transform: translateY(4px);
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
}

/* entering */
.filter-enter-from,
.filter-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
.filter-enter-to,
.filter-leave-from {
	opacity: 1;
	transform: translateY(0);
}
.filter-enter-active {
	transition: all 0.5s ease;
}
.filter-leave-active {
	transition: all 0.25s ease;
	position: absolute;
}

/* moving */
.filter-move {
	transition: transform 0.25s ease;
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

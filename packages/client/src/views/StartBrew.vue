<!--
Start Brew View
Collects the brew parameters, saves to DB, then asks whether the user
wants to brew with the recipe (→ BrewWith) or skip (→ finish now / later).

CREATED: 27MAR2026
LAST EDITED: 14APR2026
By: Aidan Boissonneault
-->

<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import { useLoadingStore } from '@/stores/loading'
import { type Bean, type Brew, type Gear } from '@terva/shared'
import { computed, onMounted, ref } from 'vue'
import { getBrewStartData } from '@/api/getStartBrewData'
import BrewDataForm from '@/components/StartBrew/BrewDataForm.vue'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import { useRouter } from 'vue-router'
import { addBrew } from '@/api/addBrew'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'

const router = useRouter()

const currentBean = ref<Bean>()
const error = ref<string | null>(null)
const data = ref()
const newBrew = ref<Brew>()

// Overlay state - 'none' | 'recipe' | 'skip'
type OverlayStep = 'none' | 'recipe' | 'skip'
const overlayStep = ref<OverlayStep>('none')

const grinders = computed(() => {
	if (!data.value?.gears) return []
	return data.value.gears.filter((g: Gear) => g.type === 'grinder')
})
const brewers = computed(() => {
	if (!data.value?.gears) return []
	return data.value.gears.filter((g: Gear) => ['brewer', 'espresso_machine'].includes(g.type))
})
const recipes = computed(() => {
	if (!data.value?.recipes) return []
	return data.value.recipes
})

onMounted(async () => {
	const loading = useLoadingStore()
	loading.start()

	const currentBeanStore = useCurrentBeanStore()
	currentBean.value = currentBeanStore.get()

	try {
		const dataPayload = await getBrewStartData()
		if (!dataPayload.success) throw new Error(dataPayload.error)
		console.log(dataPayload)
		data.value = dataPayload.payload
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		const currentBrewStore = useBrewTransferStore()
		const stored = currentBrewStore.get()
		if (stored) {
			newBrew.value = stored
			currentBrewStore.clear()
		}
		loading.stop()
	}
})

async function formSubmitted() {
	if (!newBrew.value) return

	newBrew.value.beanId = currentBean.value?.id ?? -1
	newBrew.value.status = 'in_progress'
	newBrew.value.closeness = 'close'

	const result = await addBrew(newBrew.value)
	if (result.success) newBrew.value.id = result.payload.id

	// Persist brew in transfer store so BrewWith / EndBrew can read it
	const transferBrew = useBrewTransferStore()
	transferBrew.set(newBrew.value)

	if (!newBrew.value.recipeId) {
		finishNow()
	}

	// Ask: brew with recipe, or skip?
	overlayStep.value = 'recipe'
}

// User chose to use the recipe steps
function goBrewWith() {
	overlayStep.value = 'none'
	router.push({ name: 'brewwith' })
}

// User chose to skip the recipe steps
function skipRecipe() {
	overlayStep.value = 'skip'
}

function finishNow() {
	overlayStep.value = 'none'
	router.push({ name: 'endbrew' })
}

function finishLater() {
	overlayStep.value = 'none'
	router.push({ name: 'dashboard' })
}
</script>

<template>
	<div class="dashboard">
		<div v-if="currentBean" class="bean_card">
			<BeanCard :bean="currentBean" />
		</div>
		<SectionSeperator />
		<BrewDataForm
			:recipes="recipes"
			:grinders="grinders"
			:brewers="brewers"
			v-model="newBrew"
			@form-submitted="formSubmitted"
		/>
	</div>

	<!-- Step 1: Brew with recipe? -->
	<FullscreenOverlay
		:is-visible="overlayStep === 'recipe'"
		@outside-clicked="overlayStep = 'none'"
	>
		<div class="confirm-content">
			<p><strong>Brew with recipe?</strong></p>
			<small>Follow the step-by-step timer for this recipe.</small>
			<div class="confirm-actions">
				<button class="glass secondary" @click="skipRecipe">Skip</button>
				<button class="glass" @click="goBrewWith">Brew with</button>
			</div>
		</div>
	</FullscreenOverlay>

	<!-- Step 2 (skip path): Finish now or later? -->
	<FullscreenOverlay
		:is-visible="overlayStep === 'skip'"
		@outside-clicked="overlayStep = 'none'"
	>
		<div class="confirm-content">
			<p><strong>Finish brew now?</strong></p>
			<small>You can always finish brews later.</small>
			<div class="confirm-actions">
				<button class="glass" @click="finishLater">Finish later</button>
				<button class="glass" @click="finishNow">Finish now</button>
			</div>
		</div>
	</FullscreenOverlay>
</template>

<style scoped>
.bean_card {
	width: 100%;
	grid-column: span 4;
}

.bean_card > * {
	width: 100%;
}

.dashboard {
	display: grid;
	gap: 16px;
	grid-template-columns: repeat(4, 1fr);
	margin-left: 24px;
	margin-right: 24px;
	overflow-y: visible;
}

.confirm-content,
strong {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}
</style>

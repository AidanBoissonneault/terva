<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue';
import SectionSeperator from '@/components/Utils/SectionSeperator.vue';
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean';
import { useLoadingStore } from '@/stores/loading';
import { type Bean, type Brew, type Gear } from '@terva/shared';
import { computed, onMounted, ref } from 'vue';
import { getBrewStartData } from '@/api/getStartBrewData';
import BrewDataForm from '@/components/StartBrew/BrewDataForm.vue';
import { useBrewTransferStore } from '@/stores/currentBrewTransfer';
import { useRouter } from 'vue-router';
import { addBrew } from '@/api/addBrew';
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue';

const router = useRouter()

const currentBean = ref<Bean>()
const error = ref<string | null>(null)
const data = ref()
const showOverlay = ref(false)

const newBrew = ref<Brew>()

// prep grinders and recipes for prop transfer
const grinders = computed(() => {
	if (!data.value?.gears) {
		return []
	}
	return data.value.gears.filter((g: Gear) => g.type === 'grinder')
})
const brewers = computed(() => {
	if (!data.value?.gears) {
		return []
	}
	return data.value.gears.filter((g: Gear) => ['brewer', 'espresso_machine'].includes(g.type))
})
const recipes = computed(() => {
	if (!data.value?.recipes) {
		return []
	}
	return data.value.recipes
})

onMounted(async () => {

	// start loading screen
	const loading = useLoadingStore()
	loading.start()

	// get the current bean and extract it
	const currentBeanStore = useCurrentBeanStore()
	currentBean.value = currentBeanStore.get()

	try {
		// get data
		const dataPayload = await getBrewStartData()

		// error handling
		if (!dataPayload.success) {
			throw new Error(dataPayload.error);
		}

		// log data (for testing)
		console.log(dataPayload)

		// save data
		data.value = dataPayload.payload

	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		const currentBrewStore = useBrewTransferStore()
		const stored = currentBrewStore.get()
		stored.status = 'in_progress'

		if (stored) {
			newBrew.value = stored
			currentBrewStore.clear()
		}
		loading.stop()
	}
})

async function formSubmitted() {

	//ensure brew exists
	if (!newBrew.value)
		return

	// get the bean id and upload it in
	newBrew.value.beanId = currentBean.value?.id ? currentBean.value.id : -1

	// save partial brew to db
	const data = await addBrew(newBrew.value)

	if (data.success)
		newBrew.value.id = data.payload.id

	// set up the transfer brew
	const transferBrew = useBrewTransferStore()

	transferBrew.set(newBrew.value)

	showOverlay.value = true
}
</script>

<template>
	<div class="dashboard">
		<div v-if="currentBean" class="bean_card">
			<BeanCard :bean="currentBean" />
		</div>
		<SectionSeperator />
		<BrewDataForm :recipes="recipes" :grinders="grinders" :brewers="brewers" v-model="newBrew"
			@form-submitted="formSubmitted" />
	</div>

	<FullscreenOverlay :is-visible="showOverlay" @outside-clicked="showOverlay = !showOverlay">
		<div class="confirm-content">
				<p><strong>Finish brew now?</strong></p>
				<small>You can always finish brews later.</small>
				<div class="confirm-actions">
					<button class="glass" @click="router.push({ name: 'dashboard' })">Finish later</button>
					<button class="glass" @click="router.push({ name: 'endbrew' })">Finish now</button>
				</div>
			</div>
	</FullscreenOverlay>
</template>

<style scoped>
.bean_card {
	width: 100%;
	grid-column: span 4;
}

.bean_card>* {
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
</style>

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

const router = useRouter()

const currentBean = ref<Bean>()
const error = ref<string | null>(null)
const data = ref()

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

		if (stored) {
			newBrew.value = stored
			currentBrewStore.clear()
		}
		loading.stop()
	}
})

function formSubmitted() {

	//ensure brew exists
	if (!newBrew.value)
		return

	// get the bean id and upload it in
	newBrew.value.beanId = currentBean.value?.id ? currentBean.value.id : -1

	// set up the transfer brew
	const transferBrew = useBrewTransferStore()

	transferBrew.set(newBrew.value)

	// change screens
	router.push({ name: 'endbrew' })
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
</style>

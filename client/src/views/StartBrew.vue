<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue';
import BrewDataBar from '@/components/StartBrew/BrewDataBar.vue';
import SectionSeperator from '@/components/Utils/SectionSeperator.vue';
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean';
import { useLoadingStore } from '@/stores/loading';
import { type Bean } from '@/types';
import { onMounted, ref } from 'vue';
import { getBrewStartData } from '@/api/getStartBrewData';

const currentBean = ref<Bean>()
const error = ref<string | null>(null)

onMounted(async () => {

	// start loading screen
	const loading = useLoadingStore()
	loading.start()

	const currentBeanStore = useCurrentBeanStore()
	currentBean.value = currentBeanStore.get()

	try {
		// get data
		const data = await getBrewStartData()

		// error handling
		if (!data.success) {
			throw new Error(data.error);
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
</script>

<template>
	<div class="dashboard">
		<div v-if="currentBean">
			<BeanCard :bean="currentBean" />
		</div>
		<SectionSeperator />
		<BrewDataBar />

	</div>
</template>

<style scoped>
div {
	grid-column: span 4;
}

div>* {
	width: 100%;
}
</style>

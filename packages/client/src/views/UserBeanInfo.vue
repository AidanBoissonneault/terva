<script lang="ts" setup>

import BeanCard from '@/components/BeanCard/BeanCard.vue';
import { useRouter } from 'vue-router';
import { type Brew, type Bean, type Gear, type Recipe } from '@terva/shared'
import { onMounted, ref } from 'vue';
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean';
import SectionSeperator from '@/components/Utils/SectionSeperator.vue';
import { getBrews } from '@/api/getBrews';
import { getBrewStartData } from '@/api/getStartBrewData';

const router = useRouter()

const currentBean = ref<Bean>()
const brews = ref<Brew[]>()
const gears = ref<Gear[]>()
const recipes = ref<Recipe[]>()

function skip() {
	router.push({ name: 'startbrew' })
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
})
</script>

<template>
	<div class="dashboard">
		<small>Click to Edit TODO</small>
		<BeanCard v-if="currentBean" :bean="currentBean"/>
		<SectionSeperator />
		<button @click="skip" class="glass skip">Skip</button>
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
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>

<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue'
import BrewCard from '@/components/BeanInfo/BrewCard.vue'
import { useRouter } from 'vue-router'
import { type Brew, type Bean, type Gear, type Recipe } from '@terva/shared'
import { onMounted, ref } from 'vue'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import { getBrews } from '@/api/getBrews'
import { getBrewStartData } from '@/api/getStartBrewData'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'

const router = useRouter()

const currentBean = ref<Bean>()
const brews = ref<Brew[]>([])
const gears = ref<Gear[]>([])
const recipes = ref<Recipe[]>([])

// clear the brew transfer (in case) and go to start brew
function skip() {
	const brewTransfer = useBrewTransferStore()
	brewTransfer.clear()
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
		<BeanCard v-if="currentBean" :bean="currentBean" />
		<SectionSeperator />

		<button @click="skip" class="glass skip big-text">Start Fresh</button>

		<template v-if="brews.length > 0">
			<SectionSeperator />
			<BrewCard v-for="brew in brews" :key="brew.id ?? brew.recipeId" :brew="brew" :gear="gears" :recipes="recipes" />
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
</style>

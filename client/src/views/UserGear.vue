<script setup lang="ts">
import { getGear } from '@/api/getGear';
import GearList from '@/components/Gear/GearList.vue';
import { useLoadingStore } from '@/stores/loading';
import type { Gear, GearCategory } from '@/types';
import { onMounted, ref } from 'vue';

const gears = ref<Gear[]>([])

const uniqueGearTypes = <GearCategory[]>['grinder', 'kettle', 'scale', 'brewer', 'espresso_machine']
/*
const uniqueGearTypes = computed(() => {
	if (!gears.value) return []

	return [...new Set(gears.value.map((g: Gear) => g.type))]
}) */

const error = ref<string | null>(null)

function getRelevantGear(gearType: GearCategory) {
	if (!gears.value) return []

	if (!gearType) return gears.value

	return gears.value.filter((gear: Gear) => gear.type === gearType)
}

onMounted(async () => {

	// start loading screen
	const loading = useLoadingStore()
	loading.start()
	try {
		// get data
		const data = await getGear()

		// error handling
		if (!data.success) {
			throw new Error(data.error);
		}
		// get payload
		gears.value = data.payload

		// log data (for testing)
		console.log(data)
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		loading.stop()
	}
})

const openGear = ref<string | null>(null)

function changeOpenGear(name: string | null) {
	if (openGear.value === name) {
		openGear.value = null
		return
	}
	openGear.value = name
}
</script>

<template>
	<div class="dashboard">
		<GearList v-for="gearType in uniqueGearTypes" :key="gearType" :type="gearType" :gears="getRelevantGear(gearType)" :open-gear="openGear" @change-open-gear="changeOpenGear"/>
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
</style>

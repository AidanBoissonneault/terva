<script setup lang="ts">
import { addGear } from '@/api/addGear';
import { getGear } from '@/api/getGear';
import { removeGear } from '@/api/removeGear';
import GearForm from '@/components/Gear/GearForm.vue';
import GearList from '@/components/Gear/GearList.vue';
import GearRemovalForm from '@/components/Gear/GearRemovalForm.vue';
import FullscreenOverlay from '@/components/Overlay/FullscreenOverlay.vue';
import { useLoadingStore } from '@/stores/loading';
import type { Gear, GearCategory } from '@terva/shared';
import { computed, onMounted, ref } from 'vue';

const gears = ref<Gear[]>([])

const uniqueGearTypes = <GearCategory[]>['grinder', 'kettle', 'scale', 'brewer', 'espresso_machine']

const searchBar = ref<string>("")
const search = computed(() => searchBar.value.trim().toLowerCase())
const error = ref<string | null>(null)
const openGear = ref<string | null>(null)
const showOverlay = ref<boolean>(false)
const showRemovalOverlay = ref<boolean>(false)
const removalId = ref<number>(0)
const gearCategory = ref<GearCategory>("grinder")
const removalName = ref<string>("")
const newGear = ref<Gear>()

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

function changeOpenGear(name: string | null) {
	if (openGear.value === name) {
		openGear.value = null
		return
	}
	openGear.value = name
}

function toggleOverlay(gearType: GearCategory) {
	gearCategory.value = gearType
	console.log(gearCategory.value)
	showOverlay.value = !showOverlay.value
}

async function formSubmitted() {
	console.log(newGear.value)
	if (newGear.value) {
		const result = await addGear(newGear.value)
		if (result.success) {
			newGear.value.id = result.payload.id
			gears.value.push(newGear.value)
			toggleOverlay("grinder")
		}
	}
}

// toggles the screen for when the removal overlay is seen
function toggleRemovalOverlay(id: number) {
	removalId.value = id
	showRemovalOverlay.value = !showRemovalOverlay.value
}

// sets up removal overlay screen
function getRemovalMenu(id: number, name: string) {
	removalName.value = name
	toggleRemovalOverlay(id)
}

// receives when the overlay screen is submitted
async function submitRemovalMenu(isRemoving: boolean, id: number) {
	if (isRemoving) {
		await removeSelectedGear(id)
	}
	toggleRemovalOverlay(0)
}

// ran when the overlay screen is submitted
// removes matching id
async function removeSelectedGear(id: number) {
	if (id > -1) {
		const result = await removeGear(id)
		if (result.success) {
			gears.value = gears.value.filter(gear => gear.id !== id)
			console.log("Removed gear")
		}
	}
}
</script>

<template>
	<div class="dashboard">
		<div>
			<small>Search</small>
			<input type="search" v-model="searchBar">
		</div>
		<GearList v-for="gearType in uniqueGearTypes" :key="gearType" :type="gearType" :gears="getRelevantGear(gearType)"
			:open-gear="openGear" :search="search" @change-open-gear="changeOpenGear" @create-new-gear="toggleOverlay" @remove-gear="getRemovalMenu"/>
	</div>

	<!--Submit overlay screen-->
	<FullscreenOverlay @outside-clicked="toggleOverlay('grinder')" :is-visible="showOverlay">
		<GearForm :gear-list="uniqueGearTypes" :selected-type="gearCategory" v-model="newGear" @form-submitted="formSubmitted"/>
	</FullscreenOverlay>

	<!--Removal overlay screen-->
	<FullscreenOverlay @outside-clicked="toggleRemovalOverlay(0)" :is-visible="showRemovalOverlay">
		<GearRemovalForm :name="removalName" :id="removalId" @button-pressed="submitRemovalMenu"/>
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

div {
	grid-column: span 4;
}

.stack {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
</style>

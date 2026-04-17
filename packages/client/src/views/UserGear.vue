<script setup lang="ts">
import { addGear } from '@/api/addGear'
import { editGear } from '@/api/editGear'
import { getGear } from '@/api/getGear'
import { removeGear } from '@/api/removeGear'
import GearForm from '@/components/Gear/GearForm.vue'
import GearList from '@/components/Gear/GearList.vue'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'
import { useLoadingStore } from '@/stores/loading'
import type { Gear, GearCategory } from '@terva/shared'
import { computed, onMounted, ref } from 'vue'

const gears = ref<Gear[]>([])
const uniqueGearTypes = <GearCategory[]>['grinder', 'kettle', 'scale', 'brewer', 'espresso_machine']

const searchBar = ref<string>('')
const search = computed(() => searchBar.value.trim().toLowerCase())
const error = ref<string | null>(null)

// Add overlay
const showAddOverlay = ref(false)
const gearCategory = ref<GearCategory>('grinder')
const newGear = ref<Gear>()

// Edit overlay
const showEditOverlay = ref(false)
const editForm = ref<Gear>({ id: 0, name: '', type: 'grinder', notes: '' })
const editError = ref<string | null>(null)

// Delete overlay
const showDeleteOverlay = ref(false)
const deleteTargetId = ref(0)
const deleteTargetName = ref('')

function getRelevantGear(gearType: GearCategory) {
	return gears.value.filter((g: Gear) => g.type === gearType)
}

onMounted(async () => {
	const loading = useLoadingStore()
	loading.start()
	try {
		const data = await getGear()
		if (!data.success) throw new Error(data.error)
		gears.value = data.payload
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		loading.stop()
	}
})

// Add handlers
function openAddOverlay(gearType: GearCategory) {
	gearCategory.value = gearType
	showAddOverlay.value = true
}

async function handleAddSubmit() {
	if (!newGear.value) return
	const result = await addGear(newGear.value)
	if (result.success) {
		newGear.value.id = result.payload.id
		gears.value.push({ ...newGear.value })
		showAddOverlay.value = false
	}
}

// Edit handlers
function openEditOverlay(gear: Gear) {
	editError.value = null
	editForm.value = { ...gear }
	showEditOverlay.value = true
}

async function handleEditSubmit() {
	editError.value = null
	const result = await editGear(editForm.value)
	if (result.success) {
		const idx = gears.value.findIndex((g) => g.id === editForm.value.id)
		if (idx !== -1) gears.value[idx] = { ...editForm.value }
		showEditOverlay.value = false
	} else {
		editError.value = result.error
	}
}

// Delete handlers
function requestDelete(id: number, name: string) {
	deleteTargetId.value = id
	deleteTargetName.value = name
	showDeleteOverlay.value = true
}

function cancelDelete() {
	showDeleteOverlay.value = false
	deleteTargetId.value = 0
	deleteTargetName.value = ''
}

async function confirmDelete() {
	const id = deleteTargetId.value
	cancelDelete()
	const result = await removeGear(id)
	if (result.success) {
		gears.value = gears.value.filter((g) => g.id !== id)
	}
}
</script>

<template>
	<div class="dashboard">
		<!-- Search -->
		<div class="search-row">
			<input type="search" v-model="searchBar" placeholder="Search gear…" />
		</div>

		<p v-if="error" class="error">{{ error }}</p>

		<!-- Gear sections -->
		<GearList
			v-for="gearType in uniqueGearTypes"
			:key="gearType"
			:type="gearType"
			:gears="getRelevantGear(gearType)"
			:search="search"
			@create-new-gear="openAddOverlay"
			@remove-gear="requestDelete"
			@edit-gear="openEditOverlay"
		/>
	</div>

	<!-- Add overlay -->
	<FullscreenOverlay :is-visible="showAddOverlay" @outside-clicked="showAddOverlay = false">
		<div class="overlay-form dashboard">
			<GearForm
				:gear-list="uniqueGearTypes"
				:selected-type="gearCategory"
				v-model="newGear"
				@form-submitted="handleAddSubmit"
			/>
		</div>
	</FullscreenOverlay>

	<!-- Edit overlay -->
	<FullscreenOverlay :is-visible="showEditOverlay" @outside-clicked="showEditOverlay = false">
		<div class="overlay-form dashboard">
			<p v-if="editError" class="error">{{ editError }}</p>
			<GearForm
				:gear-list="uniqueGearTypes"
				:selected-type="editForm.type"
				v-model="editForm"
				:submit-label="'Save Changes'"
				@form-submitted="handleEditSubmit"
			/>
		</div>
	</FullscreenOverlay>

	<!-- Delete confirmation overlay -->
	<FullscreenOverlay :is-visible="showDeleteOverlay" @outside-clicked="cancelDelete">
		<span class="delete-title">Delete "{{ deleteTargetName }}"?</span>
		<p class="delete-warning">This will permanently remove the gear item.</p>
		<div class="delete-actions">
			<button class="glass danger" @click="confirmDelete">Delete</button>
			<button class="glass contrast" @click="cancelDelete">Cancel</button>
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

.search-row {
	grid-column: span 4;
}

.search-row input {
	margin: 0;
}

.error {
	grid-column: span 4;
	color: var(--red-500);
	font-size: 0.85rem;
}

/* Overlay form */
.overlay-form {
	margin: 0;
	width: 100%;
}

/* Delete overlay */
.delete-title {
	font-weight: 600;
	font-size: 1rem;
}

.delete-warning {
	font-size: 0.85rem;
	opacity: 0.6;
	margin: 6px 0 16px;
}

.delete-actions {
	display: flex;
	gap: 10px;
}

.delete-actions button {
	flex: 1;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecipes } from '@/api/addRecipe'
import { removeRecipe } from '@/api/removeRecipe'
import { editRecipe } from '@/api/editRecipe'
import RecipeCard from '@/components/Recipe/RecipeCard.vue'
import RecipeForm from '@/components/Recipe/RecipeForm.vue'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'
import TervaCardSkeleton from '@/components/Skeleton/TervaCardSkeleton.vue'
import { useLoadingStore } from '@/stores/loading'
import { useErrorStore } from '@/stores/error'
import type { Recipe } from '@terva/shared'
import type { AddRecipeForm } from '@/api/addRecipe'

const loading = useLoadingStore()
const loaded = ref(false)

const router = useRouter()

const recipes = ref<Recipe[]>([])
const error = ref<string | null>(null)
const searchBar = ref('')
const search = computed(() => searchBar.value.trim().toLowerCase())

// Delete
const showDeleteOverlay = ref(false)
const deleteTargetId = ref(0)
const deleteTargetName = ref('')

// Edit
const showEditOverlay = ref(false)
const editForm = ref<AddRecipeForm & { id: number }>({
	id: 0,
	name: '',
	brewMethod: 'V60',
	defaultDoseG: 15,
	steps: [{ type: 'pour', action: '', duration: 30, waterG: null }],
})
const editError = ref<string | null>(null)

// Filtered list
const filteredRecipes = computed(() => {
	if (!search.value) return recipes.value
	return recipes.value.filter(
		(r) =>
			r.name.toLowerCase().includes(search.value) ||
			r.brewMethod.toLowerCase().includes(search.value),
	)
})

onMounted(async () => {
	loading.start()
	try {
		const result = await getRecipes()
		if (!result.success) throw new Error(result.error)
		recipes.value = result.payload
	} catch (err) {
		const errorStore = useErrorStore()
		errorStore.set(
			err instanceof Error ? err.message : 'Failed to load your recipes.',
			'recipe',
		)
		router.push({ name: 'error' })
	} finally {
		loading.stop()
		loaded.value = true
	}
})

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
	const result = await removeRecipe(id)
	if (result.success) {
		recipes.value = recipes.value.filter((r) => r.id !== id)
	} else {
		error.value = result.error
	}
}

// Edit handlers
function requestEdit(recipe: Recipe) {
	editError.value = null
	editForm.value = {
		id: recipe.id,
		name: recipe.name,
		brewMethod: recipe.brewMethod,
		defaultDoseG: recipe.defaultDoseG ?? 0,
		steps: recipe.steps.map((s) => ({
			type: s.type,
			action: s.action ?? '',
			duration: s.duration ?? null,
			waterG: s.waterG ?? null,
		})),
	}
	showEditOverlay.value = true
}

async function handleEditSubmit() {
	editError.value = null
	const result = await editRecipe(editForm.value)
	if (result.success) {
		// Update in-place so the list reflects the change immediately
		const idx = recipes.value.findIndex((r) => r.id === editForm.value.id)
		if (idx !== -1) {
			recipes.value[idx] = {
				id: editForm.value.id,
				name: editForm.value.name,
				brewMethod: editForm.value.brewMethod,
				defaultDoseG: editForm.value.defaultDoseG,
				steps: editForm.value.steps.map((s, i) => ({
					id: i,
					stepOrder: i + 1,
					type: s.type,
					action: s.action ?? undefined,
					duration: s.duration ?? undefined,
					waterG: s.waterG ?? undefined,
				})),
			}
		}
		showEditOverlay.value = false
	} else {
		editError.value = result.error
	}
}
</script>

<template>
	<div class="dashboard">
		<!-- Header row -->
		<div class="top-bar">
			<input type="search" v-model="searchBar" placeholder="Search recipes…" />
			<button class="glass" @click="router.push({ name: 'addrecipe' })">+ New Recipe</button>
		</div>

		<!-- Error -->
		<p v-if="error" class="error">{{ error }}</p>

		<!-- Empty state -->
		<template v-if="!loaded">
			<!-- still loading -->
			<TervaCardSkeleton v-for="i in 3" :key="i" :height="92" :lines="3" />
		</template>
		<template v-else-if="!error && filteredRecipes.length === 0">
			<!-- empty state -->
			<div class="empty-state">
				<p v-if="search">No recipes match "{{ search }}".</p>
				<p v-else>No recipes yet. Add your first one!</p>
			</div>
		</template>
		<template v-else>
			<!-- Recipe cards -->
			<RecipeCard
				v-for="recipe in filteredRecipes"
				:key="recipe.id"
				:recipe="recipe"
				@delete-requested="requestDelete"
				@edit-requested="requestEdit"
			/>
		</template>
	</div>

	<!-- Delete confirmation overlay -->
	<FullscreenOverlay :is-visible="showDeleteOverlay" @outside-clicked="cancelDelete">
		<span>Delete "{{ deleteTargetName }}"?</span>
		<p class="delete-warning">This will permanently remove the recipe and all its steps.</p>
		<div class="delete-actions">
			<button class="glass danger" @click="confirmDelete">Delete</button>
			<button class="glass contrast" @click="cancelDelete">Cancel</button>
		</div>
	</FullscreenOverlay>

	<!-- Edit overlay -->
	<FullscreenOverlay :is-visible="showEditOverlay" @outside-clicked="showEditOverlay = false">
		<div class="edit-overlay-inner dashboard">
			<p v-if="editError" class="error">{{ editError }}</p>
			<RecipeForm v-model="editForm" @form-submitted="handleEditSubmit" />
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

.top-bar {
	grid-column: span 4;
	display: flex;
	gap: 10px;
	align-items: center;
}

.top-bar input {
	flex: 1;
	margin: 0;
}
.top-bar button {
	flex-shrink: 0;
	white-space: nowrap;
}

.error {
	grid-column: span 4;
	color: var(--red-500);
	font-size: 0.85rem;
}

.empty-state {
	grid-column: span 4;
	text-align: center;
	opacity: 0.5;
	padding: 32px 0;
}

span {
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

.edit-overlay-inner {
	margin: 0;
	width: 100%;
}
</style>

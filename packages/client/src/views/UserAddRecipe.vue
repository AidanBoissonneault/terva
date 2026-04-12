<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeForm from '@/components/Recipe/RecipeForm.vue'
import { addRecipe, type AddRecipeForm } from '@/api/addRecipe'

const router = useRouter()

const recipe = ref<AddRecipeForm>({
	name: '',
	brewMethod: 'V60',
	steps: [{ action: '', duration: 30 }],
})

const error = ref<string | null>(null)

async function handleSubmit() {
	if (!recipe.value) return

	const result = await addRecipe(recipe.value)

	if (result.success) {
		//router.push({ name: 'recipes' })
		router.push({ name: 'dashboard' })
	} else {
		error.value = result.error
	}
}
</script>

<template>
	<div class="dashboard">
		<p v-if="error" class="error">{{ error }}</p>
		<RecipeForm v-model="recipe" @form-submitted="handleSubmit" />
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

.error {
	grid-column: span 4;
	color: var(--red-400);
	font-size: 0.85rem;
}
</style>

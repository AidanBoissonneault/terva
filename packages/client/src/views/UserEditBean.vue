<!--
Edit Bean Screen
Edits the currently selected bean, after importing it over from the current store.

CREATED ON: 08APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { editBean } from '@/api/editBean'
import BeanForm from '@/components/BeanForm/BeanForm.vue'
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean'
import type { AddBeanForm } from '@terva/shared'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

const router = useRouter()

const bean = ref<AddBeanForm>()
const beanId = ref<number>(-1)
const error = ref<string | null>(null)

onMounted(() => {
	const beanStore = useCurrentBeanStore()
	const currentBean = beanStore.get()

	beanId.value = currentBean.id

	// Pre-populate the form with the existing bean data
	bean.value = currentBean
})

async function handleFormSubmit() {
	if (!bean.value || beanId.value === -1) return

	const result = await editBean(beanId.value, bean.value)

	if (!result.success) {
		error.value = result.error
		useToastStore().show(result.error ?? 'Failed to save bean changes.', 'error')
		return
	}

	// Update the store so the bean card on the previous screen
	// reflects the changes immediately without a refetch
	const beanStore = useCurrentBeanStore()
	beanStore.set({ ...beanStore.get(), ...bean.value })

	router.push({ name: 'beaninfo' })
}
</script>

<template>
	<div class="dashboard">
		<div v-if="error" class="error">{{ error }}</div>
		<BeanForm v-model="bean" @form-submitted="handleFormSubmit" submit-label="Save Changes" />
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
	grid-column: 1 / 5;
	color: var(--red-500);
}
</style>

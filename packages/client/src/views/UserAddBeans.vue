<script setup lang="ts">
import { addBean } from '@/api/addBeans';
import BeanForm from '@/components/BeanForm/BeanForm.vue';
import type { AddBeanForm } from '@terva/shared';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';

const bean = ref<AddBeanForm>()
const router = useRouter()

async function getFormSubmit() {
	if (!bean.value) return

	const result = await addBean(bean.value)

	if (!result.success) {
		useToastStore().show(result.error ?? 'Failed to add bean.', 'error')
		return
	}

	router.push({ name: 'dashboard' })
}
</script>

<template>
	<div class="dashboard">
		<BeanForm v-model="bean" @form-submitted="getFormSubmit"/>
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

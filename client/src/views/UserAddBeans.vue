<script setup lang="ts">
import BeanForm from '@/components/BeanForm/BeanForm.vue';
import type { AddBeanForm } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// receives bean
const bean = ref<AddBeanForm>()

const router = useRouter()

// ran when the form to add a bean is submitted
function getFormSubmit() {
	console.log(bean.value)

	// TODO: add bean to database

	router.push({ name: "dashboard" })
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

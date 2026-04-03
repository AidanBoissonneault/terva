<script lang="ts" setup>

import BeanCard from '@/components/BeanCard/BeanCard.vue';
import { useRouter } from 'vue-router';
import { type Bean } from '@terva/shared'
import { onMounted, ref } from 'vue';
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean';
import SectionSeperator from '@/components/Utils/SectionSeperator.vue';

const router = useRouter()

const currentBean = ref<Bean>()

function skip() {
	router.push({ name: 'startbrew' })
}

onMounted(() => {
	const beanStore = useCurrentBeanStore()

	currentBean.value = beanStore.get()
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

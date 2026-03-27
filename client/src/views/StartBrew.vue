<script lang="ts" setup>
import BeanCard from '@/components/BeanCard/BeanCard.vue';
import SectionSeperator from '@/components/Utils/SectionSeperator.vue';
import { useCurrentBeanStore } from '@/stores/currentShowcasedBean';
import { type Bean } from '@/types';
import { onMounted, ref } from 'vue';

const currentBean = ref<Bean>()

onMounted(() => {
	const currentBeanStore = useCurrentBeanStore()
	currentBean.value = currentBeanStore.get()
})
</script>

<template>
	<div class="dashboard">
		<div v-if="currentBean">
			<BeanCard :bean="currentBean"/>
		</div>
		<SectionSeperator />
		testing start brew
	</div>
</template>

<style scoped>
div {
	grid-column: span 4;
}
div > * {
	width: 100%;
}
</style>

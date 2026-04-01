<script setup lang="ts">
import { reactive } from 'vue'
import BeanCardInfo from './BeanCardInfo.vue'
import BeanCardWrapper from './BeanCardWrapper.vue'
import QuickAccessButton from './QuickAccessButton.vue'
import { type Bean } from '@terva/shared'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	bean: Bean
}>()

const emits = defineEmits<{
	clicked: [Bean]
}>()

const buttons = reactive([{ text: 'Pour-over' }, { text: 'Sprover' }])
</script>

<template>
	<BeanCardWrapper :bean="bean" @clicked="emits('clicked', bean)">
		<BeanCardInfo
			:bean="bean"
		/>
		<div class="button-wrapper" @click.stop>
			<QuickAccessButton v-for="(btn, i) in buttons" :text="btn.text" :key="i" />
		</div>
	</BeanCardWrapper>
</template>

<style scoped>
.button-wrapper {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;

	margin-top: 4px;
}
</style>

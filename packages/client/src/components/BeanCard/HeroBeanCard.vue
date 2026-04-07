<script setup lang="ts">
import { computed } from 'vue';
import BeanCardInfo from './BeanCardInfo.vue'
import BeanCardWrapper from './BeanCardWrapper.vue'
import QuickAccessButton from './QuickAccessButton.vue'
import { type Bean, type Brew, type BrewWithRecipeName } from '@terva/shared'

const props = defineProps<{
	bean: Bean
	brews: BrewWithRecipeName[] | undefined
}>()

const emits = defineEmits<{
	clicked: [Bean]
	brewSelected: [Brew]
}>()

const brewCount = computed(() => props.brews?.length ?? 0)
const hasBrews = computed(() => brewCount.value > 0)

</script>

<template>
	<BeanCardWrapper :bean="bean" @clicked="emits('clicked', bean)">
		<BeanCardInfo :bean="bean" />
		<div class="button-wrapper" @click.stop v-if="hasBrews">
			<QuickAccessButton v-for="(brew, i) in brews" :text="brew.brewMethod" :key="i" @brew-selected="emits('brewSelected', brew)"/>
		</div>
	</BeanCardWrapper>
</template>

<style scoped>
.button-wrapper {
	display: grid;
	grid-template-columns: repeat(v-bind(brewCount), 1fr);
	gap: 16px;

	margin-top: 4px;
}
</style>

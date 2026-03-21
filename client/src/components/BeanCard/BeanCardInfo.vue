<script setup lang="ts">
import type { Bean } from '@/types';
import { getRoastLevelString } from '@/utils/BeanHelpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	bean: Bean
}>()
</script>

<template>
	<div>
		<span class="apart">
			<h2>{{ bean.name }}</h2>
			<span class="stack">
				<p v-if="!!bean.roaster">{{ bean.roaster }}</p>
				<p v-if="!!bean.roast_level">{{ getRoastLevelString(bean.roast_level) }}</p>
			</span>
		</span>
		<p>
			{{ bean.variety }}<span v-if="!!bean.process">, {{ bean.process }}</span> <br />
			{{ bean.origin }}<span v-if="!!bean.elevation_m">, {{ bean.elevation_m }} MASL</span> <br />
			{{ bean.flavour_summary }}
		</p>
	</div>
</template>

<style scoped>
div {
	--pico-color: #fff;
	--pico-h2-color: #fff;
}

.apart {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.stack {
	display: flex;
	flex-direction: column;
	text-align: right;
}

h2 {
	margin: 0;
	margin-bottom: 4px;
}
</style>

<script setup lang="ts">
import type { Bean } from '@/types';
import { getRoastLevelString } from '@/utils/BeanHelpers';
import StatusBadge from './StatusBadge.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	bean: Bean
}>()
</script>

<template>
	<div>
		<span class="apart">
			<h2>{{ bean.name }}</h2>
			<StatusBadge :status="bean.status" />
		</span>
		<span>
			<small v-if="!!bean.roaster">{{ bean.roaster }}</small>,
			<small v-if="!!bean.roast_level">{{ getRoastLevelString(bean.roast_level) }} Roast</small>
		</span>
		<div class="seperator"></div>
		<small>
			{{ bean.variety }}<span v-if="!!bean.process"><span v-if="!!bean.variety">, </span>{{ bean.process }}</span> <br />
			{{ bean.origin }}<span v-if="!!bean.elevation_m"><span v-if="bean.origin">, </span>{{ bean.elevation_m }} MASL</span> <br />
			{{ bean.flavour_summary }}
		</small>
	</div>
</template>

<style scoped>
div {
	--pico-color: #fff;
	--pico-h2-color: #fff;
}

div.seperator {
	width: 100%;
	height: 2px;
	margin: 0;
	margin-bottom: 4px;

	border-radius: 12px;
	background: linear-gradient(to bottom,
			oklch(from var(--husk-highlight) l c h / 0.1),
			oklch(from var(--husk-highlight) l c h / 0.05));
	background-color: oklch(from var(--husk-highlight) l c h / 0.2);

	box-shadow: 0 1px 3px oklch(from var(--husk-shadow) l c h / 0.1);
}

.apart {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
}
</style>

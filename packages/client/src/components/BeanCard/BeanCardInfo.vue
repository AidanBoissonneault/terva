<script setup lang="ts">
import type { Bean } from '@terva/shared';
import { getRoastLevelString } from '@/utils/BeanHelpers';
import StatusBadge from './StatusBadge.vue';
import BeanCardSeperator from './BeanCardSeperator.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	bean: Bean
}>()
</script>

<template>
	<div>
		<span class="apart">
			<h2>{{ bean.name }}</h2>
			<StatusBadge :state="bean.state" />
		</span>
		<span class="apart roaster-row">
			<small v-if="!!bean.roastLevel">{{ getRoastLevelString(bean.roastLevel) }} Roast</small>
			<small v-if="!!bean.roaster">{{ bean.roaster }}</small>
		</span>
		<BeanCardSeperator />
		<small>
			<span v-if="!!bean.variety">{{ bean.variety }}</span><span v-if="!!bean.process"><span v-if="!!bean.variety">,
				</span>{{ bean.process }}</span> <br v-if="!!bean.variety || !!bean.process" />
			<span v-if="!!bean.origin">{{ bean.origin }}</span><span v-if="!!bean.elevationM"><span v-if="bean.origin">,
				</span>{{ bean.elevationM }} MASL</span> <br v-if="!!bean.origin || !!bean.elevationM" />
			<span v-if="!!bean.flavourNotes">{{ bean.flavourNotes }}</span>
		</small>
	</div>
</template>

<style scoped>
div {
	--pico-color: #fff;
	--pico-h2-color: #fff;
}

.roaster-row {
	margin-top: 2px;
	opacity: 0.85;
}
</style>

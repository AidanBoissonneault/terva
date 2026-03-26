<script setup lang="ts">
import TabLink from '@/components/MoreView/TabLink.vue';
import router from '@/router';
import { type TabLinkType } from '@/types';

// tabs clickable in the more menu
// to add additional tabs, place the relevant info in here.
const tabs = <TabLinkType[]>[
	{ icon: "circle-user", name: "Profile", route: "profile" }
]

// enters the link supplied in the "route" section of the tab above
function goToLink(route: string) {
	router.push({ name: route })
}
</script>

<template>
	<div class="dashboard">
		<TabLink v-for="tab in tabs" :icon="tab.icon" :name="tab.name" :route="tab.route" :key="tab.name"
			@go-to-link="goToLink" />
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

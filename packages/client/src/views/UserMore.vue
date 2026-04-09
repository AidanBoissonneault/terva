<script setup lang="ts">
import TabLink from '@/components/MoreView/TabLink.vue'
import router from '@/router'
import { type TabLinkType } from '@/types'
import { authClient } from '@/lib/auth-client'

// tabs clickable in the more menu
// to add additional tabs, place the relevant info in here.
const tabs = <TabLinkType[]>[
	{ icon: 'circle-user', name: 'Profile', route: 'profile' },
	{ icon: 'scroll', name: 'Recipes', route: 'recipes' },
	{ icon: 'file-lines', name: 'Terms and Condtions', route: 'terms' },
	{ icon: 'file-lines', name: 'Privacy Policy', route: 'privacy' },
	{ icon: 'file-lines', name: 'Cookie Policy', route: 'cookies' },
]

// enters the link supplied in the "route" section of the tab above
function goToLink(route: string) {
	router.push({ name: route })
}

async function logOut() {
	await authClient.signOut()
	router.push({ name: 'login' })
}
</script>

<template>
	<div class="dashboard">
		<div class="stack">
			<TabLink
				v-for="tab in tabs"
				:icon="tab.icon"
				:name="tab.name"
				:route="tab.route"
				:key="tab.name"
				@go-to-link="goToLink"
			/>
			<a @click="logOut">Logout</a>
		</div>
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

.stack {
	grid-column: span 4;

	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: column;
}
</style>

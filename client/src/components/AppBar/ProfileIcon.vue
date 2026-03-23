<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const PAGE_NAME = 'profile'
const isActivePage = computed(() => route.name === PAGE_NAME)

const iconType = computed(() => isActivePage.value ? 'fas' : 'far')

function navigate() {
	router.push({ name: PAGE_NAME })
}
</script>

<template>
	<button @click="navigate" class="glass contrast" :class="{ isActive: isActivePage }">
		<FontAwesomeIcon :icon="[iconType, 'circle-user']" />
	</button>
</template>

<style scoped>
button {
	border-radius: 50%;
	width: 40px;
	height: 40px;

	padding: 2px;

	display: flex;
	align-items: center;
	justify-content: center;

	transition: transform 0.15s ease;
}

button:hover {
	transform: scale(1.1);
}

button svg {
	font-size: 24px;
}

.isActive {
	transform: scale(1.15);
}
</style>

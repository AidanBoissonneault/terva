<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	icon: string
	name: string
	route: string
}>()
</script>

<template>
	<div>
		<FontAwesomeIcon :icon="['fas', icon]"/>
		<RouterLink :to="route">{{ name }}</RouterLink>
	</div>
</template>

<style scoped>

</style>

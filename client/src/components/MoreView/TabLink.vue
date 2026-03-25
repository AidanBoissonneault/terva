<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	icon: string
	name: string
	route: string
}>()

const emit = defineEmits<{
	goToLink: [string]
}>()
</script>

<template>
	<div>
		<FontAwesomeIcon :icon="['fas', icon]"/>
		<a @click="emit('goToLink', route)">{{ name }}</a>
	</div>
</template>

<style scoped>

</style>

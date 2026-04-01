<script setup lang="ts">
import { fetchTest } from '@/api/test.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	text: string
}>()
</script>

<template>
	<button @click="fetchTest" class="glass big-text">{{ text }}</button>
</template>

<style scoped></style>

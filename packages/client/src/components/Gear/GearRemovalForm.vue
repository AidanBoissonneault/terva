<script setup lang="ts">

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	name: string
	id: number
}>()

const emits = defineEmits<{
	buttonPressed: [ boolean, number ]
}>()

</script>

<template>
	<span>Are you sure you want to delete the {{ name }}?</span>
	<div>
		<button class="glass" @click="emits('buttonPressed', true, id)">Yes</button>
		<button class="glass contrast"  @click="emits('buttonPressed', false, 0)">No</button>
	</div>
</template>

<style scoped>
span {
	color: var(--terva-shadow);
}
button {
	width: 50%;
}
</style>

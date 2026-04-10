<script lang="ts" setup>
const emits = defineEmits<{
	clicked: [void]
}>()
</script>

<template>
	<div @click="emits('clicked')">
			<slot />
	</div>
</template>

<style scoped>
	div {
		position: fixed;
		width: 100%;
		height: 100%;
		inset: 0;
		z-index: 9999999999;
		padding: 0;
		margin: 0;

		border: none;
		background-color: oklch(from var(--treva-shadow) l c h / 0.2);

		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);

		display: flex;
		justify-content: center;
		align-items: center;

		cursor: default;
	}
</style>

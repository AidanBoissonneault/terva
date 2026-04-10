<script lang="ts" setup></script>

<template>
	<div></div>
</template>

<style scoped>
div {
	width: 100%;
	height: 2px;
	margin: 0;
	margin-bottom: 4px;

	border-radius: var(--pico-border-radius);
	corner-shape: round;

	background: linear-gradient(to right,
			oklch(from var(--husk-highlight) l c h / 0.2),
			oklch(from var(--husk-highlight) l c h / 0.05));
	background-color: oklch(from var(--husk-highlight) l c h / 0.2);

	box-shadow: 0 1px 3px oklch(from var(--husk-shadow) l c h / 0.1);
}
</style>

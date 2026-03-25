<script lang="ts" setup></script>

<template>
	<div @click.stop>
		<slot />
	</div>
</template>

<style scoped>
div {
	border-radius: 12px;

	box-shadow: 0 2px 2px var(--husk-shadow),
							0 4px 3px oklch(from var(--husk-shadow) l c h / 0.4);

	padding: 8px;
	background: linear-gradient(to bottom,
			oklch(from var(--husk-overlay-container) calc(l + 0.3) c h / 0.25),
			oklch(from var(--husk-overlay-container) calc(l + 0.3) c h / 0.20));
	background-color: oklch(from var(--husk-overlay-container) l c h / 0.6);
	width: 60%;

	border: 1px solid oklch(from var(--pico-primary) l c h / 0.8);

	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}
</style>

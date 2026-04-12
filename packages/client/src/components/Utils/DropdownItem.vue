<!--
DropdownItem
A single item inside a DropdownMenu.
Use the `danger` prop for destructive actions.

CREATED: 12APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
defineProps<{
	danger?: boolean
}>()

const emits = defineEmits<{
	clicked: [void]
}>()
</script>

<template>
	<button
		class="dropdown-item"
		:class="{ danger }"
		role="menuitem"
		@click="emits('clicked')"
	>
		<slot />
	</button>
</template>

<style scoped>
.dropdown-item {
	display: flex;
	align-items: center;
	gap: 0.55rem;

	width: 100%;
	text-align: left;

	padding: 0.5rem 0.65rem;
	border-radius: calc(var(--pico-border-radius) - 2px);

	background: transparent;
	border: none;
	color: var(--pico-h2-color);

	cursor: pointer;
	transition: transform 0.08s ease;
	box-shadow: none;
}

.dropdown-item:hover {
	background: var(--pico-muted-border-color);
}

.dropdown-item:active {
	transform: scale(0.97);
}

.dropdown-item.danger {
	color: var(--pico-del-color);
}
</style>

<script setup lang="ts">
import { inject } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Bean } from '@terva/shared'
import DropdownMenu from '@/components/Utils/DropdownMenu.vue'
import DropdownItem from '@/components/Utils/DropdownItem.vue'
import DropdownDivider from '@/components/Utils/DropdownDivider.vue'

const props = defineProps<{
	bean: Bean
}>()

const beanEditClicked = inject<(bean: Bean) => void>('beanEditClicked')
const beanDeleteClicked = inject<(bean: Bean) => void>('beanDeleteClicked')

function onEdit(close: () => void) {
	beanEditClicked?.(props.bean)
	close()
}

function onDelete(close: () => void) {
	beanDeleteClicked?.(props.bean)
	close()
}
</script>

<template>
	<DropdownMenu :menu-width="160" :menu-height="94">
		<template #trigger="{ toggle, open }">
			<button
				class="more-button"
				aria-haspopup="menu"
				:aria-expanded="open"
				@click.stop="toggle"
			>
				<FontAwesomeIcon class="icon" :icon="['fas', 'ellipsis-vertical']" />
			</button>
		</template>

		<template #default="{ close }">
			<DropdownItem @clicked="onEdit(close)">
				<FontAwesomeIcon class="dropdown-icon" :icon="['fas', 'pen']" />
				<span>Edit</span>
			</DropdownItem>

			<DropdownDivider />

			<DropdownItem :danger="true" @clicked="onDelete(close)">
				<FontAwesomeIcon class="dropdown-icon" :icon="['fas', 'trash']" />
				<span>Delete</span>
			</DropdownItem>
		</template>
	</DropdownMenu>
</template>

<style scoped>
.more-button {
	width: 32px;
	height: 24px;
	padding: 0;
	margin: 0;
	background: none;
	border: none;
	display: block;
	cursor: pointer;
	position: relative;
	outline: none !important;
	box-shadow: none !important;
}

.more-button:focus,
.more-button:focus-visible,
.more-button:focus-within {
	outline: none !important;
	box-shadow: none !important;
}

.icon {
	width: 16px;
	height: 16px;
	display: block;
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	color: white;
	pointer-events: none;
}

.dropdown-icon {
	width: 14px;
	opacity: 0.8;
}
</style>

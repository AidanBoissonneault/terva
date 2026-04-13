<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import DropdownMenu from '@/components/Utils/Dropdown/DropdownMenu.vue'
import DropdownItem from '@/components/Utils/Dropdown/DropdownItem.vue'
import DropdownDivider from '@/components/Utils/Dropdown/DropdownDivider.vue'

const router = useRouter()

function onAddBean(close: () => void) {
	close()
	router.push({ name: 'addbeans' })
}

function onAddRecipe(close: () => void) {
	close()
	router.push({ name: 'addrecipe' })
}
</script>

<template>
	<div class="wrapper">
		<DropdownMenu :menu-width="160" :menu-height="94">
			<template #trigger="{ toggle, open }">
				<button class="transparent" :aria-expanded="open" aria-haspopup="menu" @click.stop="toggle">
					<FontAwesomeIcon :icon="['fas', 'plus']" />
				</button>
			</template>

			<template #default="{ close }">
				<DropdownItem @clicked="onAddBean(close)">
					<FontAwesomeIcon class="item-icon" :icon="['fas', 'mug-saucer']" />
					<span>Add Bean</span>
				</DropdownItem>

				<DropdownDivider />

				<DropdownItem @clicked="onAddRecipe(close)">
					<FontAwesomeIcon class="item-icon" :icon="['fas', 'scroll']" />
					<span>Add Recipe</span>
				</DropdownItem>
			</template>
		</DropdownMenu>
	</div>
</template>

<style scoped>
.wrapper {
	position: relative;
	padding: 0;
	margin: 0;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.transparent {
	font-size: 24px;
	padding: 0;
	line-height: 1;
	background: none;
	background-color: transparent;
	border: none;
	box-shadow: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: auto;
	height: 100%;
	color: var(--pico-primary);
	cursor: pointer;
}

.transparent:focus,
.transparent:focus-visible {
	outline: none;
	box-shadow: none;
}

.item-icon {
	width: 14px;
	opacity: 0.8;
}
</style>

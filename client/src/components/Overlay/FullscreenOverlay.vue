<script lang="ts" setup>
import OverlayBackground from './OverlayBackground.vue';
import OverlayCard from './OverlayCard.vue';

const emits = defineEmits<{
	outsideClicked: [void]
}>()
</script>

<template>
	<Teleport to="body">
		<OverlayBackground @clicked="emits('outsideClicked')">
			<OverlayCard>
				<slot />
			</OverlayCard>
		</OverlayBackground>
	</Teleport>
</template>

<style scoped></style>

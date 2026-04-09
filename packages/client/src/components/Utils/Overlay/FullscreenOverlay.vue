<script lang="ts" setup>
import OverlayBackground from './OverlayBackground.vue';
import OverlayCard from './OverlayCard.vue';

const emits = defineEmits<{
	outsideClicked: [void]
}>()

const props = defineProps<{
	isVisible: boolean
}>()
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<OverlayBackground @clicked="emits('outsideClicked')" v-if="props.isVisible">
				<OverlayCard @click.stop class="overlay-card">
					<slot />
				</OverlayCard>
			</OverlayBackground>
		</Transition>
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .overlay-card,
.fade-leave-to .overlay-card {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active .overlay-card,
.fade-leave-active .overlay-card {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
</style>

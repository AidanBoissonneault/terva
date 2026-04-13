<script setup lang="ts">
import { onMounted, ref } from 'vue';


const props = defineProps<{
	text: string
}>()

const emits = defineEmits<{
	brewSelected: [void]
}>()

const shortenedText = ref('')
onMounted(() => {
	const texts = props.text.split(' ')
	shortenedText.value = texts[0]?.trim() ?? ''
})
</script>

<template>
  <button @click="emits('brewSelected')" class="glass big-text">
    <FontAwesomeIcon :icon="['fas', 'arrow-rotate-right']" class="recents-icon" />
    {{ shortenedText }}
  </button>
</template>

<style scoped>
button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
}

.recents-icon {
  opacity: 0.6;
  font-size: 0.65em;
  flex-shrink: 0;
  display: block;
}
</style>

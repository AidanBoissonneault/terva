<!--
End Brew View
Used after a start brew is submitted to wrap up a brew
and submit it.

CREATED: 30MAR2026
LAST EDITED: 30MAR2026
By: Aidan Boissonneault
-->

<script lang="ts" setup>
import EndBrewDataForm from '@/components/EndBrew/EndBrewDataForm.vue';
import { useBrewTransferStore } from '@/stores/currentBrewTransfer';
import { onMounted, ref } from 'vue';
import { type Brew } from '@terva/shared'
import { editBrew } from '@/api/editBrew';
import { useRouter } from 'vue-router';

const currentBrew = ref<Brew>()
const endingBrew = ref<Brew>()

const router = useRouter()

onMounted(() => {
	const currentBrewTransfer = useBrewTransferStore()
	currentBrew.value = currentBrewTransfer.get()
})

function formSubmitted() {
	if (!endingBrew.value)
		return

	endingBrew.value.status = 'finished'

	console.log(endingBrew.value)
	editBrew(endingBrew.value.id, endingBrew.value)

	// clear cached brew
	const brewTransfer = useBrewTransferStore()
	brewTransfer.clear()

	router.push({ name: 'dashboard' })
}
</script>

<template>
	<div class="dashboard">
		<div v-if="currentBrew">
			<EndBrewDataForm :import-form="currentBrew" v-model="endingBrew" @form-submitted="formSubmitted"/>
		</div>

		<!--Error-->
		<div v-else>
			Brew transfer failed
		</div>
	</div>
</template>

<style scoped>

div {
	grid-column: span 4;
}

.dashboard {
	display: grid;
	gap: 16px;
	grid-template-columns: repeat(4, 1fr);
	margin-left: 24px;
	margin-right: 24px;

	overflow-y: visible;
	height: 100%;
}
</style>

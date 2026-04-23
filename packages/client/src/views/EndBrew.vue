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
import EndBrewHeader from '@/components/EndBrew/EndBrewHeader.vue';
import { useBrewTransferStore } from '@/stores/currentBrewTransfer';
import { onMounted, ref } from 'vue';
import { type Bean, type Brew } from '@terva/shared'
import { editBrew } from '@/api/editBrew';
import { getBeans } from '@/api/getBeans';
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/error'
import { useToastStore } from '@/stores/toast'

const SUCCESS_MESSAGES = [
	'Brew on the books.',
	'Nice pour. Saved.',
	'Another one for the journal.',
	'Brewed and filed.',
	'Logged. Time to sip.',
	'Brew recorded. Well done.',
]

function randomSuccess() {
	return SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]!
};

const currentBrew = ref<Brew>()
const endingBrew = ref<Brew>()
const currentBean = ref<Bean>()

const router = useRouter()

onMounted(async () => {
	const currentBrewTransfer = useBrewTransferStore()
	currentBrew.value = currentBrewTransfer.get()

	if (!currentBrew.value) {
		const errorStore = useErrorStore()
		errorStore.set('Brew session data was lost. Please start a new brew.', 'dashboard')
		router.push({ name: 'error' })
		return
	}

	const beansResult = await getBeans()
	if (!beansResult.success) {
		const errorStore = useErrorStore()
		errorStore.set('Failed to load bean data for this brew.', 'dashboard')
		router.push({ name: 'error' })
		return
	}

	if (currentBrew.value?.beanId) {
		currentBean.value = beansResult.payload.find((b: Bean) => b.id === currentBrew.value!.beanId)
	}
})

async function formSubmitted() {
	if (!endingBrew.value)
		return

	endingBrew.value.status = 'finished'

	const result = await editBrew(endingBrew.value.id, endingBrew.value)

	// clear cached brew
	const brewTransfer = useBrewTransferStore()
	brewTransfer.clear()

	if (result.success) {
		useToastStore().show(randomSuccess(), 'success')
	} else {
		useToastStore().show(result.error ?? 'Brew may not have saved. Check your connection.', 'error')
	}
	router.push({ name: 'dashboard' })
}
</script>

<template>
	<div class="dashboard">
		<template v-if="currentBrew">
			<EndBrewHeader v-if="currentBean" :bean="currentBean" />
			<EndBrewDataForm :import-form="currentBrew" v-model="endingBrew" @form-submitted="formSubmitted"/>
		</template>
	</div>
</template>

<style scoped>

div {
	grid-column: span 4;
}

.dashboard {
	display: grid;
	gap: 12px;
	grid-template-columns: repeat(4, 1fr);
	margin-left: 24px;
	margin-right: 24px;

	overflow-y: visible;
	height: 100%;
}
</style>

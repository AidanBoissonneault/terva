<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'
import { addBean } from '@/api/addBeans'
import { saveOnboardingStep, completeOnboarding } from '@/api/onboarding'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'

const store = useOnboardingStore()
const toast = useToastStore()
const router = useRouter()

const TOTAL_STEPS = 5
const slideDir = ref<'left' | 'right'>('left')

const progressPercent = computed(() => ((store.step - 1) / (TOTAL_STEPS - 1)) * 100)

const firstName = computed(() => {
  const name = store.userName
  return name ? name.split(' ')[0] : ''
})

function advance() {
  slideDir.value = 'left'
  store.step = Math.min(store.step + 1, TOTAL_STEPS)
  saveOnboardingStep(store.step)
}

// Step 2 — Bean
const beanName = ref('')
const beanRoaster = ref('')
const beanFlavourNotes = ref('')
const beanLoading = ref(false)

async function submitBean() {
  if (!beanName.value.trim()) return
  beanLoading.value = true
  const result = await addBean({
    name: beanName.value.trim(),
    roaster: beanRoaster.value.trim() || undefined,
    flavourNotes: beanFlavourNotes.value.trim() || undefined,
    state: 'fresh',
  })
  beanLoading.value = false
  if (!result.success) {
    toast.show(result.error ?? 'Failed to add bean.', 'error')
    return
  }
  advance()
}

// Step 3 — Recipe
function goAddRecipe() {
  advance()           // mark step 4, save to server
  store.show = false  // hide overlay while user builds recipe
  router.push({ name: 'addrecipe' })
}

// Step 5 — Done
const completing = ref(false)

async function finish() {
  completing.value = true
  await completeOnboarding()
  store.complete()
}
</script>

<template>
  <Teleport to="body">
    <div class="ob-overlay">
      <div class="ob-card">

        <!-- Progress bar + step dots -->
        <div class="ob-header">
          <div class="ob-progress-track">
            <div class="ob-progress-fill" :style="{ width: progressPercent + '%' }" />
          </div>
          <div class="ob-dots">
            <span
              v-for="i in TOTAL_STEPS"
              :key="i"
              class="ob-dot"
              :class="{ active: i === store.step, done: i < store.step }"
            />
          </div>
        </div>

        <!-- Step content -->
        <div class="ob-body">
          <Transition :name="'ob-' + slideDir" mode="out-in">
            <div :key="store.step" class="ob-step">

              <!-- ── Step 1: Welcome ── -->
              <template v-if="store.step === 1">
                <div class="ob-centered">
                  <div class="ob-welcome-text">
                    <p class="ob-app-label">Terva</p>
                    <h1 class="ob-welcome-heading">Your new brewing companion.</h1>
                    <p v-if="firstName" class="ob-greeting ob-muted">Hi {{ firstName }}!</p>
                  </div>
                  <button class="glass big-text ob-cta" @click="advance">Let's go</button>
                </div>
              </template>

              <!-- ── Step 2: Your Beans ── -->
              <template v-else-if="store.step === 2">
                <div>
                  <h2 class="ob-step-title">Your Beans</h2>
                  <p class="ob-muted">Add your first bean to start tracking what you're brewing.</p>
									<small class="ob-muted ob-field-hint">You can add more info on this bean later.</small>
                </div>
                <label>
                  Bean name
                  <input
                    v-model="beanName"
                    type="text"
                    placeholder="Ethiopia Yirgacheffe"
                    maxlength="100"
                  />
                </label>
                <label>
                  Roaster
                  <input
                    v-model="beanRoaster"
                    type="text"
                    placeholder="Square Mile"
                    maxlength="100"
                  />
                </label>
                <label>
                  Flavour notes
                  <input
                    v-model="beanFlavourNotes"
                    type="text"
                    placeholder="Blueberry, dark chocolate, citrus"
                    maxlength="200"
                  />
                  <small class="ob-muted ob-field-hint">Terva reads these to colour your bean cards.</small>
                </label>
                <div class="ob-actions">
                  <button class="glass secondary" @click="advance">Skip for now</button>
                  <button
                    class="glass"
                    :disabled="!beanName.trim() || beanLoading"
                    @click="submitBean"
										:aria-busy="beanLoading"
                  >
                    {{ beanLoading ? 'Adding…' : 'Add Bean' }}
                  </button>
                </div>
              </template>

              <!-- ── Step 3: Your Recipes ── -->
              <template v-else-if="store.step === 3">
                <div>
                  <h2 class="ob-step-title">Your Recipes</h2>
                  <p class="ob-muted">We've added 5 recipes to get you started. Build your own whenever you're ready.</p>
                </div>
                <div class="ob-defaults">
                  <p class="ob-defaults-label ob-muted">Already in your library:</p>
                  <ul class="ob-defaults-list">
                    <li>Hoffman 1-Cup V60 <span class="ob-muted">— V60, 15g, yields 280ml</span></li>
                    <li>Quan-Style Percolation <span class="ob-muted">— V60, 18g, yields 300ml</span></li>
                    <li>4-6 Method <span class="ob-muted">— V60, 20g, yields 300ml</span></li>
                    <li>Standard Espresso <span class="ob-muted">— Espresso, 18g, yields 36ml</span></li>
                    <li>Immersion / Steep &amp; Release <span class="ob-muted">— Switch / Origami, 20g yields 300ml</span></li>
                  </ul>
                </div>
                <div class="ob-actions">
                  <button class="glass secondary" @click="advance">Skip for now</button>
                  <button class="glass" @click="goAddRecipe">Add a Recipe</button>
                </div>
              </template>

              <!-- ── Step 4: Logging a Brew ── -->
              <template v-else-if="store.step === 4">
                <div>
                  <h2 class="ob-step-title">Logging a Brew</h2>
                  <p class="ob-muted">Here's what the brew session looks like before you jump in.</p>
                </div>
                <div class="ob-brew-steps">
                  <div class="ob-brew-item">
                    <span class="ob-brew-num">1</span>
                    <div>
                      <strong>Tap a bean card on the dashboard</strong>
                      <p class="ob-muted">Choose your bean and recipe to start a guided session.</p>
                    </div>
                  </div>
                  <div class="ob-brew-item">
                    <span class="ob-brew-num">2</span>
                    <div>
                      <strong>Follow the steps</strong>
                      <p class="ob-muted">
                        Setup and grind are tap-to-advance. Timed steps — bloom, pour, drawdown —
                        run a countdown. Each pour step shows you a water target in grams.
                      </p>
                    </div>
                  </div>
                  <div class="ob-brew-item">
                    <span class="ob-brew-num">3</span>
                    <div>
                      <strong>Rate your shot</strong>
                      <p class="ob-muted">
                        When done, mark the result:
                        <strong>Hit</strong> if it landed,
                        <strong>Close</strong> if almost,
                        <strong>Miss</strong> if it needs work.
                        You can also note the taste profile and body.
                      </p>
                    </div>
                  </div>
                </div>
                <button class="glass big-text ob-cta" @click="advance">Got it</button>
              </template>

              <!-- ── Step 5: Done ── -->
              <template v-else-if="store.step === 5">
                <div class="ob-centered">
                  <div class="ob-done-text">
                    <div class="ob-done-mark">&#10003;</div>
                    <h2 class="ob-done-heading">You're all set.</h2>
                    <p class="ob-muted">
                      Start tracking your brews, build your bean library,<br>
                      and dial in your perfect cup.
                    </p>
                  </div>
                  <button
                    class="glass big-text ob-cta"
                    :disabled="completing"
                    @click="finish"
                  >
                    {{ completing ? 'Loading…' : 'Go to Terva' }}
                  </button>
                </div>
              </template>

            </div>
          </Transition>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── Overlay backdrop ── */
.ob-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: oklch(0 0 0 / 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
}

/* ── Card (bottom sheet) ── */
.ob-card {
  width: 100%;
  height: 90dvh;
  display: flex;
  flex-direction: column;
  border-radius: 20px 20px 0 0;
  overflow: hidden;

  background: linear-gradient(
    to bottom,
    oklch(from var(--terva-overlay-container) calc(l + 0.3) c h / 0.25),
    oklch(from var(--terva-overlay-container) calc(l + 0.3) c h / 0.2)
  );
  background-color: oklch(from var(--terva-overlay-container) l c h / 0.97);
  border: 1px solid oklch(from var(--terva-highlight) l c h / 0.5);
  border-bottom: none;
  box-shadow: 0 -8px 40px oklch(from var(--terva-shadow) l c h / 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ── Header: progress bar + dots ── */
.ob-header {
  flex-shrink: 0;
  padding: 16px 24px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ob-progress-track {
  height: 3px;
  background: oklch(from var(--terva-app-bar-border) l c h / 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.ob-progress-fill {
  height: 100%;
  background: var(--pico-primary);
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.ob-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.ob-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: oklch(from var(--terva-app-bar-border) l c h / 0.4);
  transition: background 0.3s ease, transform 0.3s ease, width 0.3s ease;
}

.ob-dot.active {
  background: var(--pico-primary);
  transform: scale(1.25);
  width: 18px;
  border-radius: 4px;
}

.ob-dot.done {
  background: oklch(from var(--pico-primary) l c h / 0.45);
}

/* ── Body (clipping wrapper for slide transition) ── */
.ob-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ── Step container ── */
.ob-step {
  height: 100%;
  overflow-y: auto;
  padding: 28px 24px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Step slide transitions ── */
.ob-left-enter-active,
.ob-left-leave-active,
.ob-right-enter-active,
.ob-right-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

.ob-left-enter-from  { transform: translateX(32px); opacity: 0; }
.ob-left-leave-to    { transform: translateX(-32px); opacity: 0; }
.ob-right-enter-from { transform: translateX(-32px); opacity: 0; }
.ob-right-leave-to   { transform: translateX(32px); opacity: 0; }

/* ── Step 1 & 5: centred layout ── */
.ob-centered {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ob-welcome-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding-bottom: 24px;
}

.ob-app-label {
  font-size: 1.5rem;
	color: var(--pico-primary);
  text-shadow: 0px 1px var(--brand-500);
	padding: 0;
	margin: 0;
	font-family: 'Camela';
	font-weight: 500;

	--pico-font-size: 2.5rem;
	--pico-line-height: 1.125;
	--pico-typography-spacing-top: 3rem;
  margin: 0;
}

.ob-welcome-heading {
  font-size: clamp(2rem, 8vw, 2.8rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
}

.ob-greeting {
  font-size: 1rem;
  margin: 0;
}

.ob-done-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding-bottom: 24px;
}

.ob-done-mark {
  font-size: 3rem;
  color: var(--pico-primary);
  line-height: 1;
}

.ob-done-heading {
  font-size: clamp(1.6rem, 6vw, 2.2rem);
  font-weight: 700;
  margin: 0;
}

/* ── Shared CTA (steps 1, 4, 5) ── */
.ob-cta {
  width: 100%;
  flex-shrink: 0;
}

/* ── Step title (steps 2, 3, 4) ── */
.ob-step-title {
  margin: 0 0 4px;
}

/* ── Step 2: actions row ── */
.ob-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
}

/* ── Step 3: defaults list ── */
.ob-defaults {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ob-defaults-label {
  margin: 0;
  font-size: 0.8rem;
}

.ob-defaults-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
}

.ob-field-hint {
  display: block;
  margin-top: 4px;
  font-size: 0.8rem;
}

.ob-skip {
  width: 100%;
  flex-shrink: 0;
}

/* ── Step 4: brew steps ── */
.ob-brew-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ob-brew-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.ob-brew-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: oklch(from var(--pico-primary) l c h / 0.15);
  border: 1px solid oklch(from var(--pico-primary) l c h / 0.35);
  color: var(--pico-primary);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.ob-brew-item p {
  margin: 4px 0 0;
  font-size: 0.9rem;
}

/* ── Utility ── */
.ob-muted {
  color: var(--pico-muted-color);
}
</style>

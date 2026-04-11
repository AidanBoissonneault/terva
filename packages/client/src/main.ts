import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@picocss/pico/css/pico.min.css'
import '@/tokens/colorshex.css'
import '@/tokens/lightness.css'
import '@/styles/main.css'
import '@/styles/components.css'
import '@/styles/global.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faMugSaucer,
	faHouse,
	faGear,
	faCircleUser,
	faEllipsisVertical,
	faPlus,
	faScrewdriverWrench,
	faBars,
	faArrowRotateRight,
	faFileLines,
	faScroll,
	faPen,
	faCopy,
	faTrash,
	faUser,
} from '@fortawesome/free-solid-svg-icons'
import {
	faHouse as faHouseRegular,
	faCircleUser as faCircleUserRegular,
} from '@fortawesome/free-regular-svg-icons'

const app = createApp(App)

app.use(createPinia())
app.use(router)

library.add(
	faCircleUser,
	faHouse,
	faMugSaucer,
	faGear,
	faEllipsisVertical,
	faPlus,
	faHouseRegular,
	faCircleUserRegular,
	faScrewdriverWrench,
	faBars,
	faArrowRotateRight,
	faFileLines,
	faScroll,
	faPen,
	faCopy,
	faTrash,
	faUser,
)
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')

import '@/assets/styles/main.scss'
import 'v-calendar/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupCalendar } from 'v-calendar'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(setupCalendar, {
  locale: 'ko',
  navVisibility: 'click',
  titlePosition: 'center',
})

router.isReady().then(() => {
  app.mount('#app')
})

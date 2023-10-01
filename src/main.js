import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Antd)
app.use(router)
app.use(createPinia())

app.mount('#app')

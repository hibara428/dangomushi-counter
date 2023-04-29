import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './stores'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App)
app.use(store, key)
app.use(router)
app.mount('#app')

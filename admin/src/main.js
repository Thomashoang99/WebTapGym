import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import Admin from './components/wrapper/indexAdmin.vue'


const app = createApp(App)

app.use(createPinia())
app.use(router)

// Đăng ký component toàn cục
app.component("admin-layout", Admin)

// Mount vào DOM
app.mount('#app')

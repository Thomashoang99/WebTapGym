import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router'
import Admin from './components/wrapper/indexAdmin.vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Đăng ký component toàn cục
app.component("admin-layout", Admin)
app.component('QuillEditor', QuillEditor);

// Mount vào DOM
app.mount('#app')

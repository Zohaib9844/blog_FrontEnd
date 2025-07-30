import { createApp } from 'vue'
import App from './App.vue'
import '../src/style.css'
import router from './router'; // Make sure this path is correct

const app = createApp(App);
app.use(router);
app.mount('#app');

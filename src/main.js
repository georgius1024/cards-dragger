import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import store from './store';
import './assets/style.scss';

const appStore = createStore(store);
const app = createApp(App);
app.use(appStore);
app.mount('#app');

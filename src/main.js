import { createApp } from 'vue';
import App from './App.vue';
import ClickOutside from './directives/ClickOutside';
import './assets/style.scss';
const app = createApp(App);
app.directive('click-outside', ClickOutside);
app.mount('#app');

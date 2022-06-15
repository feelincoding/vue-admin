import { createApp } from 'vue';
import { createPinia } from 'pinia';
import i18n from '@/plugins/Locale';

import App from './App.vue';
import router from './router';
import '@/style/dash-board.css';
import '@/style/bootstrap.css';
import '@/style/bootstrap-vue-3.css';

import '@/style/reset.css';
import '@/style/common.css';
import '@/style/admin.css';

// import Datepicker
import Datepicker from '@vuepic/vue-datepicker';
import '@/style/vuepic-main.css';

// Optional, since every component import their Bootstrap functionality
// the following line is not necessary
// import 'bootstrap'
import BootstrapVue3 from 'bootstrap-vue-3';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(BootstrapVue3);
app.use(router);
app.use(i18n);
app.use(Toast);
app.component('Datepicker', Datepicker);
app.mount('#app');

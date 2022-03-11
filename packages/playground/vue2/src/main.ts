import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import { generate } from 'preprocess-to-css-variable/es';

Vue.use(Antd);
new Vue({
  render: (h) => h(App),
}).$mount('#app');

(async () => {
  await generate();
})();

import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import { generate } from '../../../core/dist/client/index';

Vue.use(Antd);
new Vue({
  render: (h) => h(App),
}).$mount('#app');

(async () => {
  await generate();
})();

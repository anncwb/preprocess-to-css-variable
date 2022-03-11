import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import { generate } from 'preprocess-to-css-variable/es/index';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
(async () => {
  generate();
})();

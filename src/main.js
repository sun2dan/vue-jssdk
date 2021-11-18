import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

let box = document.createElement('div');
window.__JSSDK_BOX.appendChild(box);

new Vue({
  render: h => h(App),
}).$mount(box);

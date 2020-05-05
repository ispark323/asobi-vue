import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import './plugins/bootstrap-vue';
// const fb = require('./firebase.js');

Vue.config.productionTip = false;

// fb.firebaseAuth.onAuthStateChanged(user => {
//   if (user) {
//     store.dispatch('fetchUser', user);
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

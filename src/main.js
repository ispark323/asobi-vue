import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import './plugins/bootstrap-vue';
const fb = require('@/firebase.js');
import './scss/custom.scss'; // Custom CSCC

Vue.config.productionTip = false;

// handle page reloads
let app;
fb.firebaseAuth.onAuthStateChanged(user => {
  if (user) {
    console.log('=== user logged in : ' + user.email + ' ===');
    // store.commit("setCurrentUser", user);
  }
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});

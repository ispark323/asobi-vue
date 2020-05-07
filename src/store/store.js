import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth.module';
import posts from './modules/posts.module';
import { vuexfireMutations } from 'vuexfire';
const fb = require('@/firebase.js');

Vue.use(Vuex);

// handle page reload
fb.firebaseAuth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user);
  }
});

const store = new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    auth,
    posts,
  },
});

export default store;

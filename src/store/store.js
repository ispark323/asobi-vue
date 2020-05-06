import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth.module';
import posts from './modules/posts.module';
import { vuexfireMutations } from 'vuexfire';

Vue.use(Vuex);

// export default new Vuex.Store({
const store = new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    auth,
    posts,
  },
});

export default store;

// const fb = require('@/firebase.js');
import { firebaseAuth } from '../../firebase';

const state = {
  userData: {
    isLoggedIn: false,
    userInfo: null,
    loading: false,
    error: null,
  },
};

const getters = {
  userData: state => state.userData,
};

const mutations = {
  PENDING: state => {
    state.userData = { ...state.userData, loading: true };
  },
  LOGIN: (state, userInfo) => {
    if (userInfo) {
      state.userData = { ...state.userData, loading: true, isLoggedIn: true, userInfo };
    }
  },
  LOGOUT: state => {
    state.userData = { ...state.userData, loading: true, isLoggedIn: false, userInfo: null };
  },
  REGISTER: (state, userInfo) => {
    if (userInfo) {
      state.userData = { ...state.userData, loading: true, isLoggedIn: true, userInfo };
    }
  },
  FAIL: (state, errorMessage) => {
    state.userData = {
      ...state.userData,
      loading: true,
      isLoggedIn: false,
      userInfo: null,
      error: errorMessage,
    };
  },
};

const actions = {
  login: async ({ commit }, loginData) => {
    commit('PENDING');
    try {
      const res = await firebaseAuth.signInWithEmailAndPassword(
        loginData.email,
        loginData.password
      );
      const userInfo = {
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        photoURL: res.user.photoURL,
      };
      commit('LOGIN', userInfo);
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
  logout: async ({ commit }) => {
    commit('PENDING');
    try {
      await firebaseAuth.signOut();
      commit('LOGOUT');
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
  register: async ({ commit }, registerData) => {
    commit('PENDING');
    try {
      const res = await firebaseAuth.createUserWithEmailAndPassword(
        registerData.email,
        registerData.password
      );
      // let user = fb.firebaseAuth().currentUser;
      res.user
        .updateProfile({
          displayName: registerData.username,
        })
        .then(function() {
          // Update successful.
        })
        .catch(function(error) {
          console.log(error);
          alert(error.message);
          commit('FAIL', error.message);
        });
      // fb.usersCollection.doc(res.user.uid).set({
      //   username: registerData.username,
      // });
      const userInfo = {
        username: res.user.displayName,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        photoURL: res.user.photoURL,
      };
      commit('REGISTER', userInfo);
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

import { firebaseAuth, usersCollection } from '@/firebase';
import router from '@/router/router';

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
  // isAuthenticated(state) {
  //   return state.userData !== null && state.userData != undefined;
  // },
};

const mutations = {
  setCurrentUser: (state, userInfo) => {
    if (userInfo) {
      state.userData = { ...state.userData, loading: true, isLoggedIn: true, userInfo };
    }
  },
  PENDING: state => {
    state.userData = { ...state.userData, loading: true };
  },
  LOGOUT: state => {
    state.userData = { ...state.userData, loading: true, isLoggedIn: false, userInfo: null };
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
        username: res.user.displayName,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        imageUrl: res.user.imageUrl,
        uid: res.user.uid,
      };
      commit('setCurrentUser', userInfo);
      router.push('/feed');
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
      router.push('/login');
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
      await res.user.updateProfile({
        displayName: registerData.username,
      });
      await usersCollection.doc(res.user.uid).set({
        uid: res.user.uid,
        username: registerData.username,
        email: registerData.email,
      });
      const userInfo = {
        username: res.user.displayName,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        imageUrl: res.user.imageUrl,
      };

      commit('setCurrentUser', userInfo);
      router.push('/feed');
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
  updateProfile: async (context, data) => {
    try {
      await firebaseAuth.currentUser.updateProfile({
        username: data.username,
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  },
  resetPassword: async ({ commit }, email) => {
    commit('PENDING');
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      commit('LOGOUT');
      //router.push('login');
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

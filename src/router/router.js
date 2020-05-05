import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register';
import Feed from '@/components/Feed.vue';
import Account from '@/components/Account';
// import firebase from 'firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/feed',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/feed',
    name: 'Feed',
    component: Feed,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
//   const currentUser = firebase.auth().currentUser;

//   if (requiresAuth && !currentUser) {
//     next('/login');
//   } else if (requiresAuth && currentUser) {
//     next();
//   } else {
//     next();
//   }
// });

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/Login.vue';
import Signup from '@/components/Signup';
import Feed from '@/components/Feed.vue';
import CreatePost from '@/components/CreatePost.vue';
import Profile from '@/components/Profile.vue';
import EditProfile from '@/components/EditProfile';

import firebase from 'firebase';

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
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/feed',
    name: 'Feed',
    component: Feed,
    meta: { requiresAuth: true },
  },
  {
    path: '/createpost',
    name: 'CreatePost',
    component: CreatePost,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/editprofile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.getters.isLoggedIn) {
//       next('/login');
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;

<template>
  <div id="app" class="container">
    <Navigation />
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from '@/components/Navigation.vue';
// const fb = require('@/firebase.js');

export default {
  name: 'App',
  // mounted() {
  //   fb.firebaseAuth.onAuthStateChanged();
  // },
  components: {
    Navigation,
  },
};
</script>

<style lang="scss"></style>

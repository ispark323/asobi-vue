<template>
  <div id="app" class="container">
    <Navigation />
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from '@/components/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation,
  },
};
</script>

<style lang="scss">
$primary: #bd3b6c;
@import 'node_modules/bootstrap/scss/bootstrap';
</style>

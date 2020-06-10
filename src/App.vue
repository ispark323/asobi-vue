<template>
  <div id="app" class="container">
    <Navigation />
    <hr />
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

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
  data: function() {
    return {
      user: null,
    };
  },
  components: {
    Navigation,
  },
};
</script>

<style lang="scss"></style>

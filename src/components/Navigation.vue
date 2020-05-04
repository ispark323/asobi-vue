<template>
  <div>
    <nav class="site-nav navbar navbar-expand">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Home</router-link>
        <div class="right menu">
          <div v-if="isLoggedIn" class="horizontal">
            <router-link to="/feed" class="item">Feed</router-link>
            <a class="item" @click="handleLogout">Logout</a>
          </div>

          <router-link v-else class="nav-item nav-link" to="/login">Login</router-link>
        </div>
        <!-- <div class="navbar-nav ml-auto">
          <router-link class="nav-item nav-link" to="/home" v-if="user">home</router-link>
          <router-link class="nav-item nav-link" to="/login" v-if="!user">log in</router-link>
          <router-link class="nav-item nav-link" to="/register" v-if="!user">register</router-link>
          <button class="nav-item nav-link btn btn-link" @click="$emit('logout')">logout</button>
        </div> -->
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navigation',
  computed: {
    ...mapGetters(['userData']),
    isLoggedIn() {
      return this.userData.isLoggedIn;
    },
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
.horizontal {
  display: flex;
  flex-direction: row;
}
</style>

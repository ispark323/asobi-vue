<template>
  <div>
    <nav class="site-nav navbar navbar-expand">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/feed">Home</router-link>
        <div class="right menu">
          <div v-if="isLoggedIn" class="horizontal">
            <router-link to="/createpost" class="nav-item nav-link">
              Create
            </router-link>
            <router-link to="/account" class="nav-item nav-link">
              Account
            </router-link>
            <button
              class="nav-item nav-link btn btn-link btn-outline-primary"
              @click="handleLogout"
            >
              Logout
            </button>
            {{ userDisplayname }}
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
    userDisplayname() {
      return this.userData.userInfo.displayName;
    },
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
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

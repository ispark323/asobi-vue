<template>
  <div id="navigation">
    <navbar class="navbar navbar-expand fixed-top bg-white">
      <div class="container">
        <router-link class="navbar-brand" to="/feed">
          <img src="asobi-logo.png" width="83" height="28" alt />
        </router-link>
        <div>
          <div v-if="isLoggedIn" class="horizontal">
            <router-link to="/createpost" class="nav-item nav-link m-auto">
              <b-icon icon="plus-circle" style="width: 1.5em; height: 1.5em;"></b-icon>
            </router-link>
            <router-link to="/profile" class="nav-item nav-link m-auto">
              <b-icon icon="person" style="width: 1.5em; height: 1.5em;"></b-icon>
            </router-link>
          </div>
          <router-link v-else class="nav-item nav-link" to="/login">Login/Signup</router-link>
        </div>
      </div>
    </navbar>
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
    },
  },
};
</script>

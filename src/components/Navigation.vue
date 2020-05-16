<template>
  <div id="navigation">
    <nav class="navbar navbar-expand fixed-top bg-white">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/feed">
          <img src="favicon.ico" width="30" height="30" alt="" />
        </router-link>
        <div>
          <div v-if="isLoggedIn" class="horizontal">
            <router-link to="/createpost" class="nav-item nav-link">
              <svg
                class="bi bi-pencil"
                width="30"
                height="30"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>
            <router-link to="/mypage" class="nav-item nav-link">
              <svg
                class="bi bi-person-square"
                width="30"
                height="30"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>
            <button class="nav-item nav-link btn btn-link" @click="handleLogout">
              <svg
                class="bi bi-x-square"
                width="30"
                height="30"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button class="text-secondary">
              {{ userDisplayname }}
            </button>
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

<template>
  <div id="navigation">
    <nav class="navbar navbar-expand fixed-top bg-white">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/feed">
          <img src="favicon.ico" width="30" height="30" alt />
        </router-link>
        <div>
          <div v-if="isLoggedIn" class="horizontal">
            <router-link to="/createpost" class="nav-item nav-link m-auto">
              <svg
                class="bi bi-plus-square"
                width="2em"
                height="2em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 0V8z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
                  clip-rule="evenodd"
                />
              </svg>
            </router-link>
            <router-link to="/mypage" class="nav-item nav-link m-auto">
              <svg
                class="bi bi-person-square"
                width="2em"
                height="2em"
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
                width="2em"
                height="2em"
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
            <p class="text-secondary m-auto">{{ userDisplayname }}</p>
          </div>
          <router-link v-else class="nav-item nav-link" to="/login">Login</router-link>
        </div>
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

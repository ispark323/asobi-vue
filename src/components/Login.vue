<template>
  <div>
    <form @submit.prevent>
      <input v-model="email" type="text" placeholder="Email" id="email1" />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        id="password1"
        @keypress.enter="handleLogin"
      />

      <button @click="handleLogin" class="btn btn-primary">
        Login
      </button>
    </form>
    <router-link class="nav-item nav-link" to="/register">Register</router-link>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['login']),
    handleLogin() {
      const loginData = {
        email: this.email,
        password: this.password,
      };
      this.login(loginData);
      this.$router.push('/feed');
    },
  },
};
</script>

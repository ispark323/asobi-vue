<template>
  <div id="register">
    <h3 class="text-center">Unknown girls' playground</h3>
    <br />
    <form @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <h2>Get started</h2>
          <label for="displayName">Nickname</label>
          <input v-model="displayName" type="text" placeholder="Nickname" id="displayName" />
          <br />

          <label for="email1">Email</label>
          <input v-model="email" type="text" placeholder="Email" id="email1" />
          <br />

          <label for="password1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            id="password1"
            @keypress.enter="handleRegister"
          />

          <button @click="handleRegister" class="btn btn-primary">
            Register
          </button>
        </div>
      </div>
      <div class="text-right m-2">
        <router-link class="nav-item nav-link" to="/login">Back to Login</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      displayName: '',
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['register']),
    handleRegister() {
      const registerData = {
        displayName: this.displayName,
        email: this.email,
        password: this.password,
      };
      this.register(registerData);
    },
  },
};
</script>

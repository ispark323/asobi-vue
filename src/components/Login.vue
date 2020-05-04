<template>
  <div>
    <form @submit.prevent>
      <input v-model="email" type="text" placeholder="Email" id="email1" />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        id="password1"
        @keypress.enter="handleSubmit"
      />

      <button @click="handleSubmit" class="btn btn-primary">
        Login
      </button>
    </form>
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
    handleSubmit() {
      const loginData = {
        email: this.email,
        password: this.password,
      };
      this.login(loginData);
    },
  },
};
</script>

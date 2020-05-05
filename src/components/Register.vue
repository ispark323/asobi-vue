<template>
  <div>
    <form @submit.prevent>
      <label for="username">Username</label>
      <input v-model="username" type="text" placeholder="Username" id="username" />
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
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['register']),
    handleRegister() {
      const registerData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      this.register(registerData);
      this.$router.push('/feed');
    },
  },
};
</script>

<style lang="scss" scoped></style>

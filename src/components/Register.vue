<template>
  <div>
    <form @submit.prevent>
      <label for="displayName">Display name</label>
      <input v-model="displayName" type="text" placeholder="Display name" id="displayName" />
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

<style lang="scss" scoped></style>

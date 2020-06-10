<template>
  <div
    id="signup"
    style="background: url('makeup.jpg') no-repeat center; background-size: cover;"
    class="text-center"
  >
    <!-- Sign up Form -->
    <form @submit.prevent>
      <br />
      <div class="title">Get started</div>
      <br />
      <input v-model="username" type="text" placeholder="Username" id="username" />
      <br />
      <input v-model="email" type="text" placeholder="Email" id="email1" />
      <br />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        id="password1"
        @keypress.enter="handleSignup"
      />
      <br />
      <button @click="handleSignup" class="btn btn-primary">Sign up</button>

      <div class="text-right m-2">
        <router-link class="nav-item nav-link" to="/login" style="font-size: 13px">Back to Login</router-link>
      </div>
    </form>
    <div style="height: 250px;"></div>
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
    ...mapActions(['signup']),
    handleSignup() {
      const signupData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      this.signup(signupData);
    },
  },
};
</script>

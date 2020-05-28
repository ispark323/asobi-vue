<template>
  <div id="login">
    <h3 class="text-center">Unknown girls' playground</h3>
    <br />
    <form v-if="showLoginForm" @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <h2>Log in</h2>
          <input v-model="email" type="text" placeholder="Email" id="email1" class="m-1" />
          <br />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            id="password1"
            @keypress.enter="handleLogin"
            class="m-1"
          />
          <button @click="handleLogin" class="btn btn-primary">Login</button>
        </div>
      </div>
      <div class="text-right m-2">
        <button @click="toggleForm" class="text-primary">Forgot Password</button>
        <router-link class="nav-item nav-link" to="/register">Register</router-link>
      </div>
    </form>

    <!-- Forgot Password -->
    <form v-if="!showLoginForm" @submit.prevent class="password-reset">
      <div v-if="!passwordResetSuccess">
        <div class="card bg-light">
          <div class="card-body">
            <h2>Reset Password</h2>
            <p>We will send you an email to reset your password</p>
            <label for="email2">Email</label>
            <input
              v-model.trim="passwordForm.email"
              type="text"
              placeholder="Email"
              id="email2"
              class="m-1"
            />
            <button @click="handleResetPassword" class="btn btn-primary m-1">Submit</button>
          </div>
        </div>
        <div class="text-right m-2">
          <button @click="toggleForm" class="text-primary">Back to Login</button>
        </div>
      </div>
      <div v-else>
        <div class="card bg-light">
          <div class="card-body">
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
          </div>
        </div>
        <div class="text-right m-2">
          <button @click="toggleForm" class="text-primary">Back to Login</button>
        </div>
      </div>
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
      passwordForm: {
        email: '',
      },
      showLoginForm: true,
      passwordResetSuccess: false,
    };
  },
  methods: {
    ...mapActions(['login', 'resetPassword']),
    handleLogin() {
      const loginData = {
        email: this.email,
        password: this.password,
      };
      this.login(loginData);
    },
    handleResetPassword() {
      this.resetPassword(this.passwordForm.email);
      console.log('=== email: ' + this.email);
      console.log('=== passwordFormemail: ' + this.passwordForm.email);
      this.passwordResetSuccess = true;
      this.passwordForm.email = '';
    },
    toggleForm() {
      this.errorMsg = '';
      this.showLoginForm = !this.showLoginForm;
    },
  },
};
</script>

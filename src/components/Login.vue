<template>
  <div
    id="login"
    style="background: url('makeup.jpg') no-repeat center; background-size: cover;"
    class="text-center"
  >
    <br />
    <div class="title m-1">Share your photos and</div>
    <div class="title m-1">YouTube videos you like</div>
    <!-- Login Form -->
    <form v-if="showLoginForm" @submit.prevent>
      <input v-model="email" type="text" placeholder="Email" id="email1" />
      <br />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        id="password1"
        @keypress.enter="handleLogin"
      />
      <br />
      <button @click="handleLogin" class="btn btn-primary">Login</button>
      <br />
      <br />
      <table align="center">
        <tr>
          <td>Don't have an account?</td>
          <td>
            <router-link class="nav-item nav-link" to="/signup">Sign up</router-link>
          </td>
        </tr>
      </table>
      <div class="text-right m-2">
        <b-button @click="toggleForm" variant="link" style="font-size: 13px">Forgot Password</b-button>
      </div>
    </form>

    <!-- Forgot Password -->
    <form v-if="!showLoginForm" @submit.prevent class="password-reset">
      <div v-if="!passwordResetSuccess">
        <div>
          <br />
          <h2>Reset Password</h2>
          <p>We will send you an email to reset your password.</p>
          <input
            v-model.trim="passwordForm.email"
            type="text"
            placeholder="Email"
            id="email2"
            class="m-1"
          />
          <button @click="handleResetPassword" class="btn btn-primary m-1">Submit</button>
        </div>
        <div class="text-right m-2">
          <b-button @click="toggleForm" variant="link" style="font-size: 13px">Back to Login</b-button>
        </div>
      </div>
      <!-- Forgot Password Email Sent -->
      <div v-else>
        <br />
        <h2>Email Sent</h2>
        <p>Please check your email for a link to reset your password.</p>
        <div class="text-right m-2">
          <b-button @click="toggleForm" variant="link" style="font-size: 13px">Back to Login</b-button>
        </div>
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

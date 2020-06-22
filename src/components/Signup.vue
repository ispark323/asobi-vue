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
      <b-form-group :state="usernameState" :invalid-feedback="invalidFeedback">
        <b-form-input
          id="username"
          v-model="username"
          placeholder="Username"
          :state="usernameState"
          @keypress="usernameValidation"
          @input="checkUsername"
          class="m-auto"
          style="max-width:200px"
        ></b-form-input>
      </b-form-group>
      <br />
      <b-form-group :state="emailState" invalid-feedback="girl@asobi.com">
        <b-form-input
          id="email"
          v-model="email"
          type="email"
          placeholder="Email"
          :state="emailState"
          class="m-auto"
          style="max-width:200px"
        ></b-form-input>
      </b-form-group>
      <br />
      <b-form-group :state="passwordState" invalid-feedback="At least 6 letters">
        <b-form-input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          :state="passwordState"
          class="m-auto"
          style="max-width:200px"
        ></b-form-input>
      </b-form-group>
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
      usernameState: null,
      emailState: null,
      passwordState: null,
      invalidFeedback: '',
    };
  },
  methods: {
    ...mapActions(['signup', 'isUnique']),
    handleSignup() {
      const signupData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };
      if (!this.validateUsername()) {
        this.usernameState = false;
        return;
      }
      //this.usernameState = null;
      if (!this.validateEmail()) {
        this.emailState = false;
        return;
      }
      this.emailState = null;
      if (!this.validatePassword()) {
        this.passwordState = false;
        return;
      }
      this.passwordState = null;

      this.signup(signupData);
    },
    usernameValidation: function(event) {
      const regex = new RegExp('^[a-zA-Z0-9]+$');
      const input = String.fromCharCode(event.keyCode ? event.keyCode : event.which);
      if (regex.test(input)) {
        return;
      } else {
        event.preventDefault();
        this.usernameState = false;
        setTimeout(() => {
          this.invalidFeedback = 'Only alphabets and numbers';
          this.usernameState = null;
        }, 2000);
        return;
      }
    },
    validateUsername: function() {
      if (this.username.length < 1) {
        this.invalidFeedback = 'Enter at least 1 letter';
        return false;
      } else if (this.usernameState != true) {
        return false;
      }
      return true;
    },
    validateEmail: function() {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(this.email);
    },
    validatePassword: function() {
      if (this.password.length < 6) {
        return false;
      }
      return true;
    },
    checkUsername: function() {
      if (this.username.length < 1) {
        this.invalidFeedback = 'Enter at least 1 letter';
        this.usernameState = false;
        return;
      }
      this.isUnique(this.username).then(
        response => {
          // console.log('isUnique?', response);
          if (response == 'true') this.usernameState = true;
          return;
        },
        reject => {
          // console.log('isUnique?', reject);
          this.invalidFeedback = 'This username is taken. Try another.';
          if (reject == 'false') this.usernameState = false;
          return;
        }
      );
    },
  },
};
</script>

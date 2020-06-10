<template>
  <div id="editprofile">
    <transition name="fade">
      <p v-if="showSuccess" class="success text-center">Profile updated</p>
    </transition>

    <form @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <div class="text-center">
            <h3>Edit Profile</h3>
            <br />
            <div v-if="profile.avatar">
              <b-img id="preview" v-bind:src="previewUrl" width="70" height="70" rounded="circle" />
              @{{ userData.userInfo.username }}
            </div>
            <div v-else-if="userData.userInfo.avatar">
              <b-img
                v-bind:src="userData.userInfo.avatar"
                width="70"
                height="70"
                rounded="circle"
              />
              @{{ userData.userInfo.username }}
            </div>
            <div v-else>
              <b-avatar src="user-placeholder.jpg" variant="light" size="3.5em"></b-avatar>
              @{{ userData.userInfo.username }}
            </div>
          </div>
          <br />

          <!-- Sungmin -->
          <!-- <br />Username
          <br />
          <input class="form-control" v-model="userData.userInfo.username" />
          <br />Email
          <br />
          <input class="form-control" v-model="userData.userInfo.email" disabled />
          <p style="font-size:13px;color:grey">(Email is ID and not editable.)</p>

          <button @click="handleSubmit" class="btn btn-primary mt-4">Update Profile</button> -->
          <div class="container">
            <div class="row">
              <div class="col-sm-3">
                Username:
              </div>
              <div class="col-12 col-sm-9">
                <b-form-group invalid-feedback="Only alphabets and numbers">
                  <b-form-input
                    id="usernameInput"
                    v-model="userData.userInfo.username"
                    :state="usernameState"
                    placeholder="Enter Username"
                    @keypress="usernameValidation"
                    class="m-0"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <!-- <div class="row">
              <div class="col-3">
                Location:
              </div>
              <div class="col-9">
                <b-form-group invalid-feedback="Enter at least 1 letters">
                  <b-form-input
                    id="locationInput"
                    v-model="profile.location"
                    :state="usernameState"
                    placeholder="Earth"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div> -->
            <div class="row">
              <div class="col-sm-3">
                Avatar:
              </div>
              <div class="col-12 col-sm-9">
                <b-form-file
                  id="avatarForm"
                  v-model="profile.avatar"
                  accept="image/*"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  @change="previewAvatar"
                >
                  <template slot="file-name" slot-scope="{ names }">
                    <b-badge variant="primary">{{ names[0] }}</b-badge>
                  </template>
                </b-form-file>
              </div>
            </div>
          </div>
          <div class="text-right mt-4">
            <button @click="handleSubmit" class="btn btn-primary">Update Profile</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'EditProfile',
  data() {
    return {
      showSuccess: false,
      profile: {
        username: '',
        avatar: null,
      },
      usernameState: null,
      previewUrl: '',
    };
  },
  computed: {
    ...mapGetters(['userData']),
  },
  methods: {
    ...mapActions(['updateProfile']),
    handleSubmit() {
      this.profile.username = this.userData.userInfo.username;
      if (!this.validateUsername()) {
        this.usernameState = false;
        return;
      }
      this.usernameState = null;
      this.updateProfile(this.profile);

      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
        this.profile.avatar = null;
      }, 2000);
    },
    previewAvatar: function(event) {
      const input = event.target;
      if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = e => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    usernameValidation: function(event) {
      const regex = new RegExp('^[a-zA-Z0-9]+$');
      const input = String.fromCharCode(event.keyCode ? event.keyCode : event.which);
      if (regex.test(input)) {
        return true;
      } else {
        event.preventDefault();
        this.usernameState = false;
        setTimeout(() => {
          this.usernameState = null;
        }, 2000);
        return false;
      }
    },
    validateUsername: function() {
      if (this.profile.username.length < 1) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.profile.username = this.userData.userInfo.username;
  },
};
</script>

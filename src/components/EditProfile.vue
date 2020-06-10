<template>
  <div id="editprofile">
    <transition name="fade">
      <p v-if="showSuccess" class="success text-center">Profile updated</p>
    </transition>

    <form @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <h3>Edit Profile</h3>
          <table class="mt-3">
            <tr>
              <td>
                <div v-if="profile.avatar">
                  <b-img
                    id="preview"
                    v-bind:src="previewUrl"
                    width="70"
                    height="70"
                    rounded="circle"
                  />
                </div>
                <div v-else-if="userData.userInfo.avatar">
                  <b-img
                    v-bind:src="userData.userInfo.avatar"
                    width="70"
                    height="70"
                    rounded="circle"
                  />
                </div>
                <div v-else>
                  <b-avatar src="user-placeholder.jpg" variant="light" size="3.5em"></b-avatar>
                </div>
              </td>
            </tr>
          </table>
          <div class="row mt-3">
            <div class="col-sm-3">Change profile photo</div>
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

          <div class="row m-0 mt-3">
            Username
            <input
              class="form-control"
              v-model="userData.userInfo.username"
              :state="usernameState"
            />
          </div>
          <!-- <div class="row">
              <div class="col-sm-3">Username</div>
              <div class="col-12 col-sm-9">
                <b-form-group>
                  <b-form-group invalid-feedback="Enter at least 6 letters">
                  <b-form-input
                    id="usernameInput"
                    v-model="userData.userInfo.username"
                    :state="usernameState"
                    placeholder="Enter Username"
                    class="m-2"
                  ></b-form-input>
                </b-form-group>
          </div>-->
          <div class="row m-0 mt-1">
            Email
            <input class="form-control" v-model="userData.userInfo.email" disabled />
          </div>

          <p style="font-size:13px;color:grey">(Email is ID and not editable.)</p>

          <div class="text-right mt-4">
            <b-button to="/profile" variant="dark m-1">Cancel</b-button>
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
      // if (this.profile.username.length < 6) {
      //   this.usernamestate = false;
      //   return;
      // }
      this.updateProfile(this.profile);

      // this.usernameState = null;
      this.profile.avatar = null;
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
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
  },
  mounted() {
    this.profile.username = this.userData.userInfo.username;
  },
};
</script>

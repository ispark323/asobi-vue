<template>
  <div id="editprofile">
    <transition name="fade">
      <p v-if="showSuccess" class="success text-center">Profile updated</p>
    </transition>

    <form @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <h3>Edit Profile</h3>
          <br />
          <table>
            <tr>
              <td>
                <div v-if="userData.userInfo.avatar">
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
              <td>
                <button class="btn primary m-4">
                  Change profile photo
                  <input
                    id="uploadPhotoInput"
                    type="file"
                    accept="image/*"
                    :multiple="false"
                    class="form-control"
                  />
                </button>
              </td>
            </tr>
          </table>

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
                <b-form-group invalid-feedback="Enter at least 6 letters">
                  <b-form-input
                    id="usernameInput"
                    v-model="profile.username"
                    :state="usernameState"
                    placeholder="Enter Username"
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
                  v-model="profile.avatar"
                  accept="image/*"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
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
      fileName: '',
      showSuccess: false,
      // email: this.userData.userInfo.username,
      profile: {
        username: '',
        //location: '',
        avatar: '',
      },
      usernameState: null,
      // locationState: null,
    };
  },
  computed: {
    ...mapGetters(['userData']),
  },
  methods: {
    ...mapActions(['updateProfile', 'uploadAvatar']),
    handleSubmit() {
      // const data = {
      //   username: this.userData.userInfo.username,
      // };

      // let avatar = document.getElementById('uploadPhotoInput').files[0];
      // if (avatar) {
      //   this.uploadAvatar(avatar);
      //   this.uploading = true;
      //   this.uploadEnd = true;
      // }

      if (this.profile.username.length < 6) {
        this.usernameState = false;
        return;
      }
      this.updateProfile(this.profile);

      this.usernameState = null;

      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    },
  },
  created() {
    this.profile.username = this.userData.userInfo.username;
    //this.profile.location = this.userData.userInfo.location;
  },
};
</script>

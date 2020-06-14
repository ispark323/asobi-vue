<template>
  <div id="editprofile">
    <transition name="fade">
      <p v-if="showSuccess" class="success text-center">Profile updated</p>
    </transition>

    <form @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <p style="text-align: center; font-size:1.5em;">Edit Profile</p>
          <table class="mt-3" align="center">
            <tr>
              <td v-b-modal.changeAvatar>
                <div v-if="previewUrl">
                  <b-img
                    id="preview"
                    v-bind:src="previewUrl"
                    width="80"
                    height="80"
                    rounded="circle"
                  />
                </div>
                <div v-else-if="profile.avatar">
                  <b-img
                    id="preview"
                    v-bind:src="profile.avatar"
                    width="80"
                    height="80"
                    rounded="circle"
                  />
                </div>
                <!-- <div v-else-if="userData.userInfo.avatar">
                  <b-img
                    v-bind:src="userData.userInfo.avatar"
                    width="80"
                    height="80"
                    rounded="circle"
                  />
                </div> -->
                <div v-else>
                  <b-avatar src="user-placeholder.jpg" variant="light" size="5em"></b-avatar>
                </div>
              </td>
            </tr>
          </table>

          <!-- Change Profile Photo Modal -->
          <div>
            <b-modal id="changeAvatar" title="Change Profile Photo">
              <div>
                <b-form-file
                  id="imageInput"
                  style="display:none;"
                  v-model="profile.image"
                  accept="image/*"
                  @change="previewAvatar"
                ></b-form-file>
                <b-button style="width: 200px;" variant="primary m-2" @click="editImage"
                  >Select Photo</b-button
                >
              </div>
              <b-button style="width: 200px;" variant="outline-primary m-2" @click="deleteAvatar"
                >Remove Current Photo</b-button
              >
              <template v-slot:modal-footer="{ cancel }">
                <b-button variant="dark" @click="cancel()">Cancel</b-button>
              </template>
            </b-modal>
          </div>

          <div class="row m-0 mt-3">
            Username
            <!-- <input class="form-control" v-model="profile.username" :state="usernameState" />   -->
          </div>
          <b-form-group invalid-feedback="Only alphabets and numbers">
            <b-form-input
              id="usernameInput"
              v-model="profile.username"
              :state="usernameState"
              placeholder="Enter Username"
              @keypress="usernameValidation"
              class="m-a"
            ></b-form-input>
          </b-form-group>

          <div class="row m-0 mt-1">
            Email
            <input class="form-control" v-model="userData.userInfo.email" disabled />
          </div>

          <p style="font-size:13px;color:grey">(Email is ID and not editable.)</p>

          <div class="text-right mt-4">
            <b-button to="/profile" variant="dark m-1">Cancel</b-button>
            <button @click="handleUpdateProfile" class="btn btn-primary">Update Profile</button>
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
        avatar: '', // avatar link
        image: null, // avatar file
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
    handleUpdateProfile() {
      // if nothing is changed, return
      if (
        this.profile.username == this.userData.userInfo.username &&
        this.profile.avatar == this.userData.userInfo.avatar &&
        this.profile.image == null
      ) {
        console.log('Nothing changed');
        return;
      }

      if (!this.validateUsername()) {
        this.usernameState = false;
        return;
      }
      this.usernameState = null;

      this.updateProfile(this.profile);

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
      this.$nextTick(() => {
        this.$bvModal.hide('changeAvatar');
      });
    },
    editImage() {
      const imageInput = document.getElementById('imageInput');
      imageInput.click();
    },
    deleteAvatar() {
      this.profile.image = null;
      this.profile.avatar = '';
      this.previewUrl = '';

      this.$nextTick(() => {
        this.$bvModal.hide('changeAvatar');
      });
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
    this.profile.avatar = this.userData.userInfo.avatar;
  },
};
</script>

<template>
  <div id="editprofile">
    <div>
      <transition name="fade">
        <p v-if="showSuccess" class="success">Profile updated</p>
      </transition>

      <form @submit.prevent>
        <div class="card bg-light">
          <div class="card-body">
            <h3>Edit Profile</h3>
            <div v-if="userData.userInfo.avatar">
              <b-img v-bind:src="userData.userInfo.avatar" width="50" height="50" rounded="circle" />
            </div>
            <div v-else>
              <b-avatar src="user-placeholder.jpg" variant="light" size="3.5em"></b-avatar>
              <label for="username">Username</label>
              <input v-model="userData.userInfo.username" />
            </div>
            <button>
              <input
                id="uploadPhotoInput"
                type="file"
                accept="image/*"
                :multiple="false"
                class="form-control"
              />
            </button>
            <button @click="handleSubmit" class="btn btn-primary">Update Profile</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'EditProfile',
  data() {
    return {
      // username: '',
      // // email: '',
      fileName: '',
      uploading: false,
      uploadEnd: false,
      showSuccess: false,
    };
  },
  computed: {
    ...mapGetters(['userData']),
  },
  methods: {
    ...mapActions(['updateProfile', 'uploadAvatar']),
    handleSubmit() {
      const data = {
        username: this.userData.userInfo.username,
      };

      let avatar = document.getElementById('uploadPhotoInput').files[0];
      if (avatar) {
        this.uploadAvatar(avatar);
        this.uploading = true;
        this.uploadEnd = true;
      }
      this.updateProfile(data);
      // this.username = '';
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    },
  },
};
</script>

<template>
  <div id="editprofile">
    <transition name="fade">
      <p v-if="showSuccess" class="success">Profile updated</p>
    </transition>

    <form @submit.prevent>
      <div class="card bg-light mt-4">
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

          <br />Username
          <br />
          <input class="form-control" v-model="userData.userInfo.username" />
          <br />Email
          <br />
          <input class="form-control" v-model="userData.userInfo.email" disabled />
          <p style="font-size:13px;color:grey">(Email is ID and not editable.)</p>

          <button @click="handleSubmit" class="btn btn-primary mt-4">Update Profile</button>
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
      uploading: false,
      uploadEnd: false,
      showSuccess: false,
      email: this.userData.userInfo.username,
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

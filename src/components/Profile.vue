<template>
  <div id="profile">
    <h3 class="text-center">Unknown girls' playground</h3>
    <br />
    <div>
      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <div class="card bg-light">
          <div class="card-body">
            <h2>Profile</h2>
            <label for="username">Username</label>
            <input
              v-model.trim="username"
              type="text"
              :placeholder="userData.userInfo.username"
              id="username"
            />
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
  data() {
    return {
      username: '',
      showSuccess: false,
    };
  },
  computed: {
    ...mapGetters(['userData']),
  },
  methods: {
    ...mapActions(['updateProfile']),
    handleSubmit() {
      const data = {
        username: this.username !== '' ? this.username : this.userProfile.name,
      };
      this.updateProfile(data);
      this.username = '';
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    },
  },
};
</script>

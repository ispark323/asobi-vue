<template>
  <section id="account">
    <div>
      <p>Profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="displayName">Nickname</label>
        <input
          v-model.trim="displayName"
          type="text"
          :placeholder="userData.userInfo.displayName"
          id="displayName"
        />
        <br />
        <button @click="handleSubmit" class="btn btn-primary">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      displayName: '',
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
        displayName: this.displayName !== '' ? this.displayName : this.userProfile.name,
      };
      this.updateProfile(data);
      this.displayName = '';
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped></style>

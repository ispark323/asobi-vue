<template>
  <div>
    <router-link to="/account" class="nav-item nav-link">
      Edit Profile
    </router-link>
    <div class="post-container">
      <div v-if="getPosts.length">
        <div v-for="post in getPosts" :key="post.id">
          {{ post.title }}
          {{ post.content }}
        </div>
      </div>
      <div v-else>
        <p class="no-results">There are currently no posts.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MyPage',
  computed: mapGetters(['getPosts']),
  methods: mapActions(['bindPosts']),
  created() {
    this.bindPosts();
  },
};
</script>

<style lang="scss" scoped></style>

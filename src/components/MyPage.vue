<template>
  <div id="mypage">
    <h3 class="text-center">Unknown girls' playground</h3>
    <router-link to="/account" class="nav-item nav-link text-right">
      Edit Profile
    </router-link>
    <div class="post-container">
      <div class="card bg-light">
        <div class="card-body">
          <h2>My Posts</h2>
          <div v-if="getPosts.length">
            <div v-for="post in getPosts" :key="post.id">
              <div v-if="post.uid == userData.userInfo.uid">
                {{ post.title }}
                {{ post.link }}
              </div>
            </div>
          </div>
          <div v-else>
            <p class="no-results">There are currently no posts.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MyPage',
  computed: mapGetters(['userData', 'getPosts']),
  methods: mapActions(['bindPosts']),
  created() {
    this.bindPosts();
  },
};
</script>

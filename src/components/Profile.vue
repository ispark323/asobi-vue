<template>
  <div id="profile">
    <div class="card bg-light text-center mt-4">
      <div>
        <br />
        <div v-if="userData.userInfo.avatar">
          <b-img v-bind:src="userData.userInfo.avatar" width="50" height="50" rounded="circle" />
          @{{ userData.userInfo.username }}
        </div>
        <div v-else>
          <b-avatar src="user-placeholder.jpg" variant="light" size="3.5em"></b-avatar>
          @{{ userData.userInfo.username }}
        </div>
      </div>
      <p></p>
      <div>
        <b-button to="/editprofile" variant="primary m-1">Edit Profile</b-button>
        <br />
        <button @click="handleLogout" class="btn btn-dark m-1">Logout</button>
      </div>
      <br />
    </div>

    <div class="card bg-light mt-4">
      <div class="card-body">
        <h2>My Posts</h2>
        <div v-if="getPosts.length">
          <div v-for="(post, index) in getPosts" :key="post.id">
            <div v-if="post.ownerId == userData.userInfo.uid">
              <li>
                {{ post.text }}
                <!-- {{ post.mediaUrl }}, -->
                <small class="text-muted">@ {{ post.createdAt.toDate().toLocaleString() }}</small>
                <button @click="handleDelete(index)" class="btn btn-link">
                  <svg
                    class="bi bi-x-square"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Profile',
  computed: mapGetters(['userData', 'getPosts']),
  methods: {
    ...mapActions(['bindPostsRef', 'deletePost', 'logout']),
    handleDelete(index) {
      const post = {
        id: this.getPosts[index].id,
        text: this.getPosts[index].text,
      };
      if (confirm('Delete your post?\n"' + post.text + '"')) {
        this.deletePost(post);
      }
    },
    handleLogout() {
      this.logout();
    },
  },
  created() {
    this.bindPostsRef();
  },
};
</script>

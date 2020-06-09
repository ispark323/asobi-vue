<template>
  <div id="profile">
    <div class="card bg-light text-center mt-4">
      <div>
        <br />
        <div v-if="userData.userInfo.avatar">
          <b-avatar v-bind:src="userData.userInfo.avatar" variant="light" size="3.5em"></b-avatar>
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
        <b-button v-b-modal.changeP variant="primary m-1">Change Password</b-button>
        <br />
        <button @click="handleLogout" class="btn btn-dark m-1">Logout</button>
      </div>
      <br />
    </div>

    <!-- Change Password -->
    <div>
      <b-modal id="changeP" title="Change Password">
        <p>We will send you an email to reset your password.</p>
        <input class="form-control" v-model="userData.userInfo.email" disabled />
        <template v-slot:modal-footer="{ cancel }">
          <b-button size="sm" variant="dark" @click="cancel()">Cancel</b-button>
          <b-button size="sm" variant="primary m-1" @click="handleResetPassword">Submit</b-button>
        </template>
      </b-modal>
    </div>

    <div class="card bg-light mt-4">
      <div class="card-body">
        <h2>My Posts</h2>
        <div v-if="getMyPosts.length">
          <div class="container">
            <div v-for="(post, index) in getMyPosts" :key="post.id">
              <div class="row">
                <div class="col-sm-9 p-0">{{ post.text.replace(/(.{50})..+/, '$1…') }}</div>
                <div class="col-12 col-sm-3 text-right p-0">
                  {{ timeFromCreated(index) }}
                  <b-icon
                    icon="pencil-square"
                    v-on:click="showEditMyPost(index)"
                    variant="primary"
                    class="mr-1"
                  ></b-icon>
                  <b-icon
                    icon="x-circle"
                    v-on:click="handleDelete(index)"
                    variant="primary"
                    class="mr-1"
                  ></b-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts.</p>
        </div>
      </div>
    </div>

    <!-- Edit my post -->
    <b-modal id="editMyPost" title="Edit" @ok="handleEditMyPost">
      <b-form-group label="Text:" label-for="text1" invalid-feedback="Text is required">
        <b-form-textarea
          id="text1"
          v-model="editedPost.text"
          :state="textState"
          placeholder="Enter at least 1 letters"
          rows="3"
          max-rows="10"
          required
        ></b-form-textarea>
      </b-form-group>
      <div v-if="postType == 'media'">
        <b-form-group label="Link:" label-for="mediaUrl" invalid-feedback="URL is required">
          <b-form-textarea
            id="mediaUrl"
            v-model="editedPost.mediaUrl"
            :state="mediaUrlState"
            placeholder="Enter at least 1 letters"
            rows="2"
            max-rows="3"
            required
          ></b-form-textarea>
        </b-form-group>
      </div>
      <div v-else-if="postType == 'image'">
        <b-form-file
          v-model="editedPost.image"
          accept="image/*"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
        >
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="primary">{{ names[0] }}</b-badge>
          </template>
        </b-form-file>
      </div>
      <!-- Footer -->
      <template v-slot:modal-footer="{ cancel }">
        <b-button size="sm" variant="primary" @click="handleEditMyPost">Edit</b-button>
        <b-button size="sm" variant="primary" @click="cancel()">Cancel</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      editedPost: {
        ownerId: '',
        postId: '',
        text: '',
        mediaUrl: '',
        imageUrl: '',
        image: null,
      },
      textState: null,
      mediaUrlState: null,
      imageUrlState: null,
      postType: '',
      postIndex: '',
    };
  },
  computed: mapGetters(['userData', 'getMyPosts']),
  methods: {
    ...mapActions(['bindMyPostsRef', 'editPost', 'deletePost', 'logout', 'resetPassword']),
    handleDelete(index) {
      const post = {
        id: this.getMyPosts[index].id,
        text: this.getMyPosts[index].text,
      };
      if (confirm('Delete your post?\n"' + post.text + '"')) {
        this.deletePost(post);
      }
    },
    handleLogout() {
      this.logout();
    },
    handleResetPassword() {
      this.resetPassword(this.userData.userInfo.email);
      alert('Email sent. Please check your email.');
      this.$nextTick(() => {
        this.$bvModal.hide('changeP');
      });
    },
    timeFromCreated(index) {
      var today = new Date();
      var msPerDay = 24 * 60 * 60 * 1000;
      var days = (today.getTime() - this.getMyPosts[index].createdAt.toDate().getTime()) / msPerDay;

      if (days < 1) {
        return Math.round(days * 24) + 'h';
      } else {
        return Math.round(days) + 'd';
      }
    },
    showEditMyPost(index) {
      this.postIndex = index;
      this.editedPost.ownerId = this.getMyPosts[index].ownerId;
      this.editedPost.postId = this.getMyPosts[index].postId;
      this.editedPost.text = this.getMyPosts[index].text;
      this.editedPost.mediaUrl = this.getMyPosts[index].mediaUrl;
      this.editedPost.imageUrl = this.getMyPosts[index].imageUrl;
      this.textState = null;
      this.mediaUrlState = null;
      this.imageUrlState = null;
      if (this.editedPost.mediaUrl) {
        this.postType = 'media';
      } else if (this.editedPost.imageUrl) {
        this.postType = 'image';
      }
      this.$bvModal.show('editMyPost');
    },
    handleEditMyPost(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (this.editedPost.text.length < 1) {
        this.textState = false;
        return;
      } else if (this.postType == 'media' && this.editedPost.mediaUrl.length < 1) {
        this.mediaUrlState = false;
        return;
      } else if (this.postType == 'image' && this.editedPost.imageUrl.length < 1) {
        this.imageUrlState = false;
        return;
      }

      this.editPost(this.editedPost);

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('editMyPost');
      });
    },
  },
  created() {
    this.bindMyPostsRef();
  },
};
</script>

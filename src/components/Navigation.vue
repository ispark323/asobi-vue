<template>
  <div id="navigation">
    <nav class="navbar navbar-expand fixed-top bg-white">
      <router-link class="navbar-brand" to="/feed">asobi</router-link>
      <div class="navbar-nav ml-auto">
        <div v-if="isLoggedIn" class="horizontal">
          <router-link to="/feed" class="nav-item nav-link mr-1">
            <b-icon id="feed" icon="house" style="width: 1.5em; height: 1.5em;"></b-icon>
            <!-- <b-tooltip target="feed" title="FEED" triggers="hover" placement="bottomleft" ></b-tooltip> -->
          </router-link>
          <div class="nav-item nav-link m-auto">
            <b-icon
              id="post"
              v-b-modal.createPost
              icon="plus-circle"
              variant="primary"
              style="width: 1.5em; height: 1.5em;"
            ></b-icon>
            <!-- <b-tooltip target="post" title="POST" triggers="hover" placement="bottomleft" ></b-tooltip> -->
          </div>
          <!-- <router-link to="/createpost" class="nav-item nav-link m-auto">
            <b-icon icon="plus-circle" style="width: 1.5em; height: 1.5em;"></b-icon>
          </router-link>-->
          <router-link to="/profile" class="nav-item nav-link m-auto">
            <b-icon id="profile" icon="person" style="width: 1.5em; height: 1.5em;"></b-icon>
            <!-- <b-tooltip target="profile" title="PROFILE" triggers="hover" placement="bottomleft" ></b-tooltip> -->
          </router-link>
        </div>
        <router-link v-else class="nav-item nav-link" to="/login">Login/Signup</router-link>
      </div>
    </nav>

    <!-- Create Post -->
    <b-modal
      id="createPost"
      title="Create Post"
      @show="showCreatePost"
      @ok="handleCreatePost"
      return-focus="null"
    >
      <b-form-radio-group
        v-model="postType"
        :options="options"
        :state="postTypeState"
        name="posttype"
        invalid-feedback="Please select one"
      ></b-form-radio-group>
      <div v-if="postType == 'image'">
        <b-form-group label="Text:" label-for="text1" invalid-feedback="Please enter text">
          <b-form-textarea
            id="text1"
            v-model="post.text"
            :state="textState"
            placeholder="Share your story"
            rows="3"
            max-rows="10"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-form-group invalid-feedback="Image is required">
          <b-form-file
            v-model="post.image"
            :state="imageState"
            accept="image/*"
            placeholder="Choose photo or drop it here..."
            drop-placeholder="Drop file here..."
          >
            <template slot="file-name" slot-scope="{ names }">
              <b-badge variant="primary">{{ names[0] }}</b-badge>
            </template>
          </b-form-file>
        </b-form-group>
      </div>
      <div v-else-if="postType == 'media'">
        <b-form-group label="Link:" label-for="mediaUrl" invalid-feedback="Please put YouTube link">
          <b-form-textarea
            id="mediaUrl"
            v-model="post.mediaUrl"
            :state="mediaUrlState"
            placeholder="https://"
            rows="1"
            max-rows="3"
            required
          ></b-form-textarea>
        </b-form-group>
      </div>

      <!-- Create Post Modal Footer -->
      <template v-slot:modal-footer="{ cancel }">
        <b-button variant="dark" @click="cancel()">Cancel</b-button>
        <b-button variant="primary m-1" @click="handleCreatePost">Post</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navigation',
  data() {
    return {
      post: {
        text: '',
        mediaUrl: '',
        image: null,
        ownerId: '',
        username: '',
        avatar: '',
      },
      textState: null,
      mediaUrlState: null,
      imageState: null,
      postType: '',
      postTypeState: null,
      options: [
        { text: 'Photo', value: 'image' },
        { text: 'Youtube', value: 'media' },
      ],
    };
  },
  computed: {
    ...mapGetters(['userData']),
    isLoggedIn() {
      return this.userData.isLoggedIn;
    },
  },
  methods: {
    ...mapActions(['logout', 'createPost2']),
    handleLogout() {
      this.logout();
    },
    showCreatePost() {
      this.post.text = '';
      this.post.image = null;
      this.post.mediaUrl = '';
      this.textState = null;
      this.mediaUrlState = null;
      this.imageState = null;
      this.postType = '';
      this.postTypeState = null;
    },
    handleCreatePost(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (this.postType.length < 1) {
        this.postTypeState = false;
        return;
      } else this.postTypeState = null;

      if (this.postType == 'image' && this.post.text.length < 1) {
        this.textState = false;
        return;
      } else this.textState = true;

      if (this.postType == 'image' && this.post.image == null) {
        this.imageState = false;
        return;
      } else this.imageState = true;

      if (this.postType == 'media' && this.post.mediaUrl.length < 1) {
        this.mediaUrlState = false;
        return;
      } else this.mediaUrlState = true;

      if (this.postType == 'media') {
        let url = this.post.mediaUrl;
        if (url.includes('https://youtu.be/')) {
          url = url.replace('youtu.be', 'youtube.com/embed');
        } else if (url.includes('https://www.youtube.com/watch?v')) {
          url = url.replace('watch?v=', 'embed/');
        } else if (!url.includes('https://www.youtube.com/embed/')) {
          this.mediaUrlState = false;
          return;
        }
        this.post.mediaUrl = url;
      }

      this.post.ownerId = this.userData.userInfo.uid;
      this.post.username = this.userData.userInfo.username;
      this.post.avatar = this.userData.userInfo.avatar;
      this.createPost2(this.post);

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('createPost');
      });
    },
  },
};
</script>
